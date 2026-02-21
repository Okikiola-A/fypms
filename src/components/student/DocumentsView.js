import React, { useState } from 'react';
import { Upload, FileText, Eye, Download, X, Search } from 'lucide-react';

const DocumentsView = ({ documents, darkMode }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>My Documents</h3>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
        >
          <Upload size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by name or status..."
          className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'} border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showUpload && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Upload New Document</h4>
            <button onClick={() => setShowUpload(false)} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              <X size={20} />
            </button>
          </div>
          <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-500'} rounded-lg p-8 text-center transition-all duration-200 cursor-pointer`}>
            <Upload className={`mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} size={48} />
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Click to upload or drag and drop</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>PDF, DOC, DOCX (Max 10MB)</p>
          </div>
        </div>
      )}

      {/* Results count */}
      {searchQuery && (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Found {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
        </p>
      )}

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
        {filteredDocuments.length > 0 ? (
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <tr>
                <th className={`text-left p-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Document Name</th>
                <th className={`text-left p-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Upload Date</th>
                <th className={`text-left p-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                <th className={`text-left p-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Feedback</th>
                <th className={`text-left p-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map(doc => (
                <tr key={doc.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-indigo-600" size={20} />
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{doc.name}</span>
                    </div>
                  </td>
                  <td className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{doc.uploadDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      doc.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    {doc.feedback || 'No feedback yet'}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="p-8 text-center">
              <FileText className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchQuery ? 'No documents found matching your search' : 'No documents yet'}
              </p>
            </div>
          )}
        </div>
      </div>
  );
};

export default DocumentsView;