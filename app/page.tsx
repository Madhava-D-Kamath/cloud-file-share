"use client";

import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  MoreVertical, 
  Plus, 
  Search, 
  HardDrive, 
  Clock, 
  Star, 
  Trash2,
  Share2,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const FILES = [
  { id: 1, name: "Project Proposal.pdf", type: "pdf", size: "2.4 MB", updated: "2h ago", color: "#f87171" },
  { id: 2, name: "Brand Assets.zip", type: "zip", size: "45.8 MB", updated: "5h ago", color: "#60a5fa" },
  { id: 3, name: "Meeting Notes.docx", type: "doc", size: "156 KB", updated: "1d ago", color: "#818cf8" },
  { id: 4, name: "Homepage Mockup.png", type: "image", size: "4.2 MB", updated: "2d ago", color: "#34d399" },
  { id: 5, name: "Financial Report 2024.xlsx", type: "sheet", size: "1.1 MB", updated: "3d ago", color: "#fbbf24" },
  { id: 6, name: "User Research.mp4", type: "video", size: "128.5 MB", updated: "1w ago", color: "#a78bfa" },
];

export default function Dashboard() {
  const [files, setFiles] = useState(FILES);
  const [trash, setTrash] = useState<any[]>([]);
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [search, setSearch] = useState("");

  const getFilteredFiles = () => {
    let baseFiles = currentTab === 'trash' ? trash : files;
    
    if (currentTab === 'starred') {
      baseFiles = files.filter(f => starredIds.includes(f.id));
    } else if (currentTab === 'recent') {
      baseFiles = files.filter(f => f.updated.includes('h ago') || f.updated === 'Just now');
    }

    return baseFiles.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  };

  const filteredFiles = getFilteredFiles();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.type.split('/')[1] || 'file',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        updated: "Just now",
        color: ["#f87171", "#60a5fa", "#818cf8", "#34d399", "#fbbf24", "#a78bfa"][Math.floor(Math.random() * 6)]
      };
      setFiles([newFile, ...files]);
      setCurrentTab('all');
    }
  };

  const triggerUpload = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleDelete = (id: number) => {
    if (currentTab === 'trash') {
      setTrash(trash.filter(f => f.id !== id));
    } else {
      const fileToDelete = files.find(f => f.id === id);
      if (fileToDelete) {
        setTrash([fileToDelete, ...trash]);
        setFiles(files.filter(f => f.id !== id));
      }
    }
  };

  const toggleStar = (id: number) => {
    setStarredIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleDownload = (filename: string) => {
    const blob = new Blob(["This is a mock file content for " + filename], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShare = (filename: string) => {
    const dummyUrl = `https://clouddrop.io/share/${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(dummyUrl);
    alert(`Link copied to clipboard for: ${filename}\nURL: ${dummyUrl}`);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <HardDrive size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>CloudDrop</h1>
        </div>

        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={handleUpload} 
        />
        <button 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
          onClick={triggerUpload}
        >
          <Plus size={20} />
          <span>Upload File</span>
        </button>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button 
            onClick={() => setCurrentTab('all')} 
            className={`nav-link ${currentTab === 'all' ? 'active' : ''}`}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <Folder size={20} /> <span>All Files</span>
          </button>
          <button 
            onClick={() => setCurrentTab('recent')} 
            className={`nav-link ${currentTab === 'recent' ? 'active' : ''}`}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <Clock size={20} /> <span>Recent</span>
          </button>
          <button 
            onClick={() => setCurrentTab('starred')} 
            className={`nav-link ${currentTab === 'starred' ? 'active' : ''}`}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <Star size={20} /> <span>Starred</span>
          </button>
          <button 
            onClick={() => setCurrentTab('trash')} 
            className={`nav-link ${currentTab === 'trash' ? 'active' : ''}`}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <Trash2 size={20} /> <span>Trash</span>
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Storage</span>
              <span style={{ fontWeight: '600' }}>75% used</span>
            </div>
            <div className="storage-bar">
              <div className="storage-progress" style={{ width: '75%' }}></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              15.2 GB of 20 GB used
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '400px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search files, folders..." 
              className="glass"
              style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'grid', placeItems: 'center', border: '1px solid var(--glass-border)' }}>
              <Star size={18} />
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </header>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px', textTransform: 'capitalize' }}>
                {currentTab === 'all' ? 'All Files' : `${currentTab} Files`}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                {currentTab === 'trash' ? 'Items in trash will be permanently deleted' : 'Manage and access your latest uploads'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="glass" style={{ padding: '8px 16px', borderRadius: '8px', color: 'white', fontSize: '0.875rem' }}>Grid View</button>
              <button style={{ padding: '8px 16px', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', background: 'transparent', border: 'none' }}>List View</button>
            </div>
          </div>

          <div className="grid">
            {filteredFiles.map((file, index) => (
              <motion.div 
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card"
                style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${file.color}20`, display: 'grid', placeItems: 'center' }}>
                    {file.type === 'image' ? <ImageIcon color={file.color} /> : <FileText color={file.color} />}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      style={{ background: 'transparent', border: 'none', color: starredIds.includes(file.id) ? '#fbbf24' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                      onClick={() => toggleStar(file.id)}
                    >
                      <Star size={20} fill={starredIds.includes(file.id) ? '#fbbf24' : 'transparent'} />
                    </button>
                    <button 
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)' }}>
                  <span>{file.size}</span>
                  <span>{file.updated}</span>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
                  <button 
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => handleDownload(file.name)}
                  >
                    <Download size={16} />
                    <span style={{ fontSize: '0.75rem' }}>Download</span>
                  </button>
                  <button 
                    style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}
                    onClick={() => handleShare(file.name)}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
