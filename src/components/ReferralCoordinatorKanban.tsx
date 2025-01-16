import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { fetchPatients, updatePatientStatus, calculateDistanceMatrix, fetchMessages, addMessage } from '../api/referralCoordinatorApi';
import { Patient, PatientsByStatus, Message } from '../types/referral';
import { MessageCircle, Loader2, Send, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statuses = [
  'New',
  'Acknowledge Receipt',
  'Verified Insurance',
  'Information Needed',
  'Needs to Be Assigned',
  'Needs Scheduling',
] as const;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

const ReferralCoordinatorKanban: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientsByStatus>({});
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatVisible) {
      scrollToBottom();
    }
  }, [messages, chatVisible]);

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      const groupedByStatus = statuses.reduce((acc, status) => {
        acc[status] = data.filter((patient) => patient.status === status);
        return acc;
      }, {} as PatientsByStatus);
      setPatients(groupedByStatus);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const patientId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    try {
      await updatePatientStatus(patientId, newStatus);
      await loadPatients();
    } catch (error) {
      console.error('Failed to update patient status:', error);
    }
  };

  const handleOpenChat = async (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation(); // Prevent navigation when opening chat
    setSelectedPatient(patient);
    setChatVisible(true);
    setLoadingMessages(true);
    try {
      const patientMessages = await fetchMessages(patient.id);
      setMessages(patientMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPatient || !newMessage.trim()) return;

    try {
      const message = await addMessage(selectedPatient.id, newMessage.trim(), 'Jane (Coordinator)');
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Referral Coordinator Kanban Board</h2>
        <button
          onClick={() => navigate('/referrals/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Patient</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statuses.map((status) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">{status}</h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[200px]"
                  >
                    {patients[status]?.map((patient, index) => (
                      <Draggable
                        key={patient.id}
                        draggableId={String(patient.id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/patients/${patient.id}`)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{patient.name}</h4>
                                <p className="text-sm text-gray-500">
                                  Referral: {new Date(patient.referralDate).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleOpenChat(e, patient)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <MessageCircle size={20} />
                              </button>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>{patient.insuranceProvider}</p>
                              <p>{patient.contactNumber}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Chat Modal */}
      {chatVisible && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Chat - {selectedPatient.name}</h3>
              <button
                onClick={() => {
                  setChatVisible(false);
                  setSelectedPatient(null);
                  setMessages([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="h-96 overflow-y-auto mb-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{message.sender}</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700">{message.content}</p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralCoordinatorKanban;