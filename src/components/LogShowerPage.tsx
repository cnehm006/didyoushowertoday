import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Smile, Frown, Meh, Plus, Save, CheckCircle, Trash2 } from 'lucide-react';
import './LogShowerPage.css';
import { AnimatePresence } from 'framer-motion';

const LogShowerPage: React.FC = () => {
  const { user, updateShowerData, deleteShowerEntry } = useUser();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [showered, setShowered] = useState(false);
  const [vibe, setVibe] = useState(5);
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  if (!user) return null;

  const availableProducts = ['shampoo', 'bodyWash', 'conditioner', 'faceWash', 'none'];

  const handleProductToggle = (product: string) => {
    if (product === 'none') {
      setProducts([]);
    } else {
      setProducts(prev => 
        prev.includes(product) 
          ? prev.filter(p => p !== product)
          : [...prev.filter(p => p !== 'none'), product]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date();
      const entry = {
        id: `${selectedDate}-${Date.now()}`,
        date: selectedDate,
        timestamp: now.toISOString(),
        showered,
        vibe,
        notes: notes.trim() || undefined,
        products: products.length > 0 ? products : ['none']
      };

      await updateShowerData(entry);
      setShowSuccess(true);
      
      // Reset form
      setShowered(false);
      setVibe(5);
      setNotes('');
      setProducts([]);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error logging shower:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (window.confirm(t('confirmDeleteEntry'))) {
      setDeletingEntryId(entryId);
      try {
        await deleteShowerEntry(entryId);
      } catch (error) {
        console.error('Error deleting entry:', error);
      } finally {
        setDeletingEntryId(null);
      }
    }
  };

  const getVibeIcon = (vibeLevel: number) => {
    if (vibeLevel >= 7) return <Smile className="vibe-icon" />;
    if (vibeLevel >= 4) return <Meh className="vibe-icon" />;
    return <Frown className="vibe-icon" />;
  };

  const getVibeColor = (vibeLevel: number) => {
    if (vibeLevel >= 7) return '#10b981'; // green
    if (vibeLevel >= 4) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getVibeDescription = (vibeLevel: number) => {
    if (vibeLevel >= 8) return t('vibeAmazing');
    if (vibeLevel >= 6) return t('vibeGood');
    if (vibeLevel >= 4) return t('vibeOkay');
    if (vibeLevel >= 2) return t('vibeBad');
    return t('vibeTerrible');
  };

  return (
    <div className="log-shower-page">
      <motion.div 
        className="log-shower-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="log-shower-header glass">
          <h1>{t('logShower')}</h1>
          <p>{t('logShowerDescription')}</p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              className="success-message glass"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={24} />
              <span>{t('showerLoggedSuccessfully')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log Form */}
        <motion.form 
          className="log-form glass"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Date Selection */}
          <div className="form-section">
            <label className="form-label">
              <Calendar size={20} />
              {t('date')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={(() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })()}
              className="form-input"
            />
          </div>

          {/* Shower Toggle */}
          <div className="form-section">
            <label className="form-label">
              🚿 {t('didYouShower')}
            </label>
            <div className="toggle-container">
              <motion.button
                type="button"
                className={`toggle-btn ${showered ? 'active' : ''}`}
                onClick={() => setShowered(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('yes')}
              </motion.button>
              <motion.button
                type="button"
                className={`toggle-btn ${!showered ? 'active' : ''}`}
                onClick={() => setShowered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('no')}
              </motion.button>
            </div>
          </div>

          {/* Vibe Level */}
          <div className="form-section">
            <label className="form-label">
              {getVibeIcon(vibe)}
              {t('howAreYouFeeling')}
            </label>
            <div className="vibe-slider-container">
              <input
                type="range"
                min="1"
                max="10"
                value={vibe}
                onChange={(e) => setVibe(Number(e.target.value))}
                className="vibe-slider"
                style={{ '--vibe-color': getVibeColor(vibe) } as any}
              />
              <div className="vibe-display">
                <span className="vibe-number">{vibe}</span>
                <span className="vibe-text">{getVibeDescription(vibe)}</span>
              </div>
            </div>
          </div>

          {/* Products Used */}
          <div className="form-section">
            <label className="form-label">
              🧴 {t('productsUsed')}
            </label>
            <div className="products-grid">
              {availableProducts.map((product) => (
                <motion.button
                  key={product}
                  type="button"
                  className={`product-btn ${products.includes(product) ? 'active' : ''}`}
                  onClick={() => handleProductToggle(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(product)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <label className="form-label">
              📝 {t('notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="form-textarea"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Save size={20} />
                {t('logEntry')}
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Recent Entries */}
        <motion.div 
          className="recent-entries glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>{t('recentEntries')}</h2>
          {user.showerData.length === 0 ? (
            <div className="empty-state">
              <p>{t('noEntriesYet')}</p>
              <p>{t('startLoggingToSeeHistory')}</p>
            </div>
          ) : (
            <div className="entries-list">
              {user.showerData
                .sort((a, b) => {
                  // Sort by date first, then by timestamp if available
                  const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
                  if (dateComparison !== 0) return dateComparison;
                  
                  // If same date, sort by timestamp (newest first)
                  if (a.timestamp && b.timestamp) {
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                  }
                  
                  // If one has timestamp and other doesn't, prioritize the one with timestamp
                  if (a.timestamp && !b.timestamp) return -1;
                  if (!a.timestamp && b.timestamp) return 1;
                  
                  return 0;
                })
                .slice(0, 5)
                .map((entry, index) => (
                  <motion.div
                    key={entry.id || `${entry.date}-${index}`}
                    className="entry-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="entry-header">
                      <div className="entry-date">{(() => {
                        const [year, month, day] = entry.date.split('-');
                        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString();
                      })()}</div>
                      {entry.timestamp ? (
                        <div className="entry-time">
                          {new Date(entry.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>
                      ) : (
                        <div className="entry-time">No time recorded</div>
                      )}
                      <motion.button
                        className="delete-entry-btn"
                        onClick={() => handleDeleteEntry(entry.id)}
                        disabled={deletingEntryId === entry.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={t('deleteEntry')}
                      >
                        {deletingEntryId === entry.id ? (
                          <div className="loading-spinner small" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </motion.button>
                    </div>
                    <div className="entry-status">
                      {entry.showered ? '🚿' : '❌'} {entry.showered ? t('showered') : t('noShower')}
                    </div>
                    <div className="entry-vibe">
                      {getVibeIcon(entry.vibe)} {entry.vibe}/10
                    </div>
                    {entry.products && entry.products.length > 0 && (
                      <div className="entry-products">
                        <span className="products-label">🧴 {t('productsUsed')}:</span>
                        <span className="products-list">
                          {entry.products.map((product, idx) => (
                            <span key={idx} className="product-tag">
                              {t(product)}
                            </span>
                          )).join(', ')}
                        </span>
                      </div>
                    )}
                    {entry.notes && (
                      <div className="entry-notes">"{entry.notes}"</div>
                    )}
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LogShowerPage; 