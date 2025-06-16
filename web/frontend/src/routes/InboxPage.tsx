import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabContainer, { Tab } from '../components/containers/TabContainer';
import { Card } from '../components/cards';
import Modal from '../components/modals/Modal';
import { PrimaryButton, SecondaryButton } from '../components/buttons';
import { mailApi } from '../api/projectApi';
import { Mail } from '../interfaces/interfaces';
import { formatDistanceToNow } from 'date-fns';
import { UserSearchBarByEmail } from '../components/search';
import ErrorAlert from '../components/notifications/ErrorAlert';

const InboxPage = () => {
  // State
  const [mails, setMails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch mails on tab change
  useEffect(() => {
    fetchMails(activeTab);
  }, [activeTab]);

  // Fetch mails from API
  const fetchMails = async (type: 'received' | 'sent') => {
    setIsLoading(true);
    setError(null);
    setActionError(null);
    try {
      const data = type === 'received' 
        ? await mailApi.getReceived() 
        : await mailApi.getSent();
        
      if (data.success) {
        setMails(data.mails);
        if (data.mails.length > 0 && !selectedMail) {
          setSelectedMail(data.mails[0]);
        } else if (data.mails.length === 0) {
          setSelectedMail(null);
        }
      } else {
        setError('Failed to load emails');
      }
    } catch (error) {
      setError('An error occurred while fetching emails');
      console.error('Error fetching emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark mail as read
  const markAsRead = async (mailId: string) => {
    setActionError(null);
    try {
      const response = await mailApi.markAsRead(mailId);
      
      if (response.success) {
        // Update the mail in the local state
        setMails(prevMails => 
          prevMails.map(mail => 
            mail._id === mailId ? { ...mail, read: true } : mail
          )
        );
        
        if (selectedMail && selectedMail._id === mailId) {
          setSelectedMail({ ...selectedMail, read: true });
        }
      } else {
        setActionError(response.message || 'Failed to mark email as read');
      }
    } catch (error) {
      setActionError('Error marking email as read');
      console.error('Error marking email as read:', error);
    }
  };

  // Handle mail click
  const handleMailClick = (mail: Mail) => {
    setSelectedMail(mail);
    if (!mail.read && activeTab === 'received') {
      markAsRead(mail._id);
    }
  };
  
  // Handle accept invite
  const handleAcceptInvite = async (mailId: string) => {
    setActionError(null);
    try {
      const data = await mailApi.acceptInvite(mailId);
      
      if (data.success) {
        // Update the mail in the local state
        setMails(prevMails => 
          prevMails.map(mail => 
            mail._id === mailId ? { ...mail, status: 'accepted' } : mail
          )
        );
        
        if (selectedMail && selectedMail._id === mailId) {
          setSelectedMail({ ...selectedMail, status: 'accepted' });
        }
        
        // Navigate to the project page if applicable
        if (data.project && data.project._id) {
          navigate(`app/projects/${data.project._id}`);
        }
      } else {
        setActionError(data.message || 'Failed to accept invitation');
      }
    } catch (error : any) {
      setActionError('Error accepting invitation: ' + error.message);
      console.error('Error accepting invitation:', error);
    }
  };

  // Handle decline invite
  const handleDeclineInvite = async (mailId: string) => {
    setActionError(null);
    try {
      const data = await mailApi.declineInvite(mailId);
      
      if (data.success) {
        // Update the mail in the local state
        setMails(prevMails => 
          prevMails.map(mail => 
            mail._id === mailId ? { ...mail, status: 'declined' } : mail
          )
        );
        
        if (selectedMail && selectedMail._id === mailId) {
          setSelectedMail({ ...selectedMail, status: 'declined' });
        }
      } else {
        setActionError(data.message || 'Failed to decline invitation');
      }
    } catch (error) {
      setActionError('Error declining invitation');
      console.error('Error declining invitation:', error);
    }
  };

  // Handle delete mail
  const handleDeleteMail = async (mailId: string) => {
    if (!confirm('Are you sure you want to delete this email?')) return;
    
    setActionError(null);
    try {
      const data = await mailApi.delete(mailId);
      
      if (data.success) {
        // Remove the mail from the local state
        setMails(prevMails => prevMails.filter(mail => mail._id !== mailId));
        
        if (selectedMail && selectedMail._id === mailId) {
          setSelectedMail(mails.length > 1 ? mails.find(mail => mail._id !== mailId) || null : null);
        }
      } else {
        setActionError(data.message || 'Failed to delete email');
      }
    } catch (error) {
      setActionError('Error deleting email');
      console.error('Error deleting email:', error);
    }
  };

  // Handle email sent
  const handleEmailSent = () => {
    setIsComposeModalOpen(false);
    // Refresh mails if we're in the sent tab
    if (activeTab === 'sent') {
      fetchMails('sent');
    }
  };

  // Render mail list
  const renderMailList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <ErrorAlert error={error} onDismiss={() => setError(null)} />
        </div>
      );
    }

    if (mails.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">No emails found</div>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {mails.map(mail => (
          <div 
            key={mail._id} 
            className={`
              p-4 cursor-pointer transition-colors duration-150
              ${selectedMail && selectedMail._id === mail._id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
              ${!mail.read && activeTab === 'received' ? 'font-semibold' : ''}
            `}
            onClick={() => handleMailClick(mail)}
          >
            <div className="flex justify-between">
              <div className="font-medium">
                {activeTab === 'received' ? mail.sender.name : mail.recipient.name}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(mail.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="text-sm font-medium mt-1">{mail.subject}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
              {mail.body}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render mail detail
  const renderMailDetail = () => {
    if (!selectedMail) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="text-gray-500">Select an email to view</div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {actionError && (
          <ErrorAlert 
            error={actionError} 
            onDismiss={() => setActionError(null)} 
            className="mb-4"
          />
        )}
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">{selectedMail.subject}</h2>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {activeTab === 'received' ? `From: ${selectedMail.sender.name}` : `To: ${selectedMail.recipient.name}`}
              </span>
              <span className="mx-2">•</span>
              <span>
                {formatDistanceToNow(new Date(selectedMail.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div>
            <SecondaryButton
              text="Delete"
              onClick={() => handleDeleteMail(selectedMail._id)}
              size="sm"
            />
          </div>
        </div>
          <div className="prose dark:prose-invert max-w-none">
          {selectedMail.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {selectedMail.type === 'invite' && 
         selectedMail.status !== 'accepted' && 
         selectedMail.status !== 'declined' && 
         activeTab === 'received' && (
          <div className="mt-6 flex gap-4">
            <PrimaryButton
              text="Accept Invitation"
              onClick={() => handleAcceptInvite(selectedMail._id)}
            />
            <SecondaryButton
              text="Decline Invitation"
              onClick={() => handleDeclineInvite(selectedMail._id)}
            />
          </div>
        )}
        
        {selectedMail.type === 'invite' && selectedMail.status === 'accepted' && activeTab === 'received' && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md">
            You have accepted this invitation.
          </div>
        )}
        
        {selectedMail.type === 'invite' && selectedMail.status === 'declined' && activeTab === 'received' && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 p-3 rounded-md">
            You have declined this invitation.
          </div>
        )}
      </div>
    );
  };

  // Tab configuration
  const tabs: Tab[] = [
    {
      id: 'received',
      label: 'Received',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[calc(100vh-200px)]">
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 overflow-y-auto h-full">
            {renderMailList()}
          </div>
          <div className="md:col-span-2 overflow-y-auto h-full">
            {renderMailDetail()}
          </div>
        </div>
      )
    },
    {
      id: 'sent',
      label: 'Sent',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[calc(100vh-200px)]">
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 overflow-y-auto h-full">
            {renderMailList()}
          </div>
          <div className="md:col-span-2 overflow-y-auto h-full">
            {renderMailDetail()}
          </div>
        </div>
      )
    }
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'received' | 'sent');
    setSelectedMail(null);
    setActionError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
        <PrimaryButton
          text="Compose"
          icon="✉️"
          onClick={() => setIsComposeModalOpen(true)}
        />
      </div>

      <Card className="overflow-hidden">
        <TabContainer
          tabs={tabs}
          defaultTabId="received"
          variant="underline"
          onChange={handleTabChange}
        />
      </Card>

      {/* Compose Email Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        title="Compose Email"
        size="2xl"
      >
        <MailForm 
          onClose={() => setIsComposeModalOpen(false)} 
          onSent={handleEmailSent} 
        />
      </Modal>
    </div>
  );
};

// MailForm component
interface MailFormProps {
  onClose: () => void;
  onSent: () => void;
  projectId?: string;
}

// Define User interface for email recipients
interface User {
  _id: string;
  email: string;
  name: string;
}

const MailForm: React.FC<MailFormProps> = ({ onClose, onSent, projectId }) => {
  // State for the form
  const [recipients, setRecipients] = useState<User[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recipients.length === 0) {
      setError('Please add at least one recipient');
      return;
    }
    
    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }
    
    if (!body.trim()) {
      setError('Message is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const emailData = {
        recipients: recipients.map(user => user.email),
        subject,
        body,
        type: 'custom',
        projectId
      };
      
      const data = await mailApi.sendCustom(emailData);
      
      if (data.success) {
        onSent();
      } else {
        setError(data.message || 'Failed to send email');
      }
    } catch (error) {
      setError('An error occurred while sending the email');
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle user selection from search
  const handleUserSelect = (user: User) => {
    if (!recipients.find(r => r._id === user._id)) {
      setRecipients([...recipients, user]);
    }
  };
  
  // Handle user removal
  const handleUserRemove = (userId: string) => {
    setRecipients(recipients.filter(user => user._id !== userId));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <ErrorAlert 
          error={error} 
          onDismiss={() => setError(null)} 
        />
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          To:
        </label>
        <UserSearchBarByEmail
          onUserSelect={handleUserSelect}
          placeholder="Search for users by email..."
          variant="outlined"
          showRecentSearches={true}
          selectedUsers={recipients}
          onUserRemove={handleUserRemove}
          searchOnEnterOnly={false}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject:
        </label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2"
          placeholder="Subject"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message:
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2"
          rows={10}
          placeholder="Write your message here..."
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <SecondaryButton
          text="Cancel"
          onClick={onClose}
        />
        <PrimaryButton
          text="Send"
          type="submit"
          loading={isLoading}
        />
      </div>
    </form>
  );
};

export default InboxPage;
