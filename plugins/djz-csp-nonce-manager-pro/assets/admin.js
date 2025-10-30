/**
 * DJ Zen Eyer - CSP Nonce Manager PRO
 * Admin Dashboard JavaScript (v2.5.0)
 * @package DJZenEyerCSPManagerPRO
 */

(function() {
    'use strict';

    // ============================================
    // 🎯 INITIALIZATION
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔒 DJ Zen Eyer CSP Admin v' + (window.djzeCspAdmin?.version || '2.5.0'));
        
        // Initialize components
        djzeCspInit();
    });

    // ============================================
    // 🔧 INITIALIZATION FUNCTION
    // ============================================

    function djzeCspInit() {
        // Tab switching
        initTabSwitching();
        
        // Auto-refresh logs
        if (document.getElementById('djze-logs-container')) {
            initAutoRefreshLogs();
        }
        
        // Copy to clipboard
        initCopyToClipboard();
        
        // Form handlers
        initFormHandlers();
    }

    // ============================================
    // 🔄 TAB SWITCHING
    // ============================================

    function initTabSwitching() {
        const tabs = document.querySelectorAll('.nav-tab');
        
        if (!tabs.length) return;
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                const tabName = this.getAttribute('data-tab');
                if (!tabName) return;
                
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('nav-tab-active'));
                
                // Hide all content
                document.querySelectorAll('.djze-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('nav-tab-active');
                
                // Show selected content
                const content = document.getElementById(tabName);
                if (content) {
                    content.classList.add('active');
                }
                
                console.log('📑 Switched to tab: ' + tabName);
            });
        });
    }

    // ============================================
    // 📋 AUTO-REFRESH LOGS
    // ============================================

    function initAutoRefreshLogs() {
        const container = document.getElementById('djze-logs-container');
        
        if (!container) return;
        
        // Refresh every 30 seconds
        setInterval(function() {
            refreshLogs();
        }, 30000);
    }

    function refreshLogs() {
        if (!window.djzeCspAdmin || !window.djzeCspAdmin.nonce) {
            return;
        }
        
        const data = new FormData();
        data.append('action', 'djze_get_logs');
        data.append('nonce', window.djzeCspAdmin.nonce);
        
        fetch(ajaxurl, {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data && result.data.logs) {
                const container = document.getElementById('djze-logs-container');
                if (container) {
                    container.innerHTML = result.data.logs;
                    console.log('✅ Logs refreshed');
                }
            }
        })
        .catch(error => {
            console.error('❌ Error refreshing logs:', error);
        });
    }

    // ============================================
    // 📋 CLEAR LOGS
    // ============================================

    window.djzeCspClearLogs = function() {
        if (!window.djzeCspAdmin) {
            alert('❌ Admin data not available');
            return;
        }
        
        const confirmMsg = window.djzeCspAdmin.i18n?.confirm_clear || 
                          'Are you sure you want to clear all logs?';
        
        if (!confirm(confirmMsg)) {
            return;
        }
        
        const data = new FormData();
        data.append('action', 'djze_clear_logs');
        data.append('nonce', window.djzeCspAdmin.nonce);
        
        showLoadingSpinner('Clearing logs...');
        
        fetch(ajaxurl, {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            hideLoadingSpinner();
            
            if (result.success) {
                showNotification(
                    window.djzeCspAdmin.i18n?.logs_cleared || 'Logs cleared successfully!',
                    'success'
                );
                
                // Refresh logs display
                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                showNotification(
                    result.data?.message || 'Error clearing logs',
                    'error'
                );
            }
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error('❌ Error clearing logs:', error);
            showNotification('Error clearing logs: ' + error.message, 'error');
        });
    };

    // ============================================
    // 📥 EXPORT LOGS
    // ============================================

    window.djzeCspExportLogs = function(format) {
        if (!window.djzeCspAdmin || !window.djzeCspAdmin.nonce) {
            alert('❌ Admin data not available');
            return;
        }
        
        if (format !== 'csv' && format !== 'json') {
            alert('❌ Invalid format');
            return;
        }
        
        showLoadingSpinner('Exporting logs (' + format.toUpperCase() + ')...');
        
        const data = new FormData();
        data.append('action', 'djze_export_logs');
        data.append('format', format);
        data.append('nonce', window.djzeCspAdmin.nonce);
        
        fetch(ajaxurl, {
            method: 'POST',
            body: data
        })
        .then(response => {
            hideLoadingSpinner();
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // Get filename from header or create one
            const filename = 'csp-logs-' + new Date().toISOString().split('T')[0] + '.' + format;
            
            return response.blob().then(blob => ({
                blob: blob,
                filename: filename
            }));
        })
        .then(result => {
            // Create download link
            const url = window.URL.createObjectURL(result.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename;
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showNotification('✅ Logs exported as ' + format.toUpperCase(), 'success');
            console.log('✅ Exported logs as ' + result.filename);
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error('❌ Error exporting logs:', error);
            showNotification('Error exporting logs: ' + error.message, 'error');
        });
    };

    // ============================================
    // 📋 COPY TO CLIPBOARD
    // ============================================

    function initCopyToClipboard() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('djze-copy-btn')) {
                const text = e.target.getAttribute('data-text') || 
                           document.getElementById(e.target.getAttribute('data-id'))?.textContent;
                
                if (text) {
                    copyToClipboard(text);
                    
                    const originalText = e.target.textContent;
                    e.target.textContent = '✅ Copied!';
                    
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 2000);
                }
            }
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('✅ Copied to clipboard');
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            console.log('✅ Copied to clipboard (fallback)');
        }
    }

    // ============================================
    // 📝 FORM HANDLERS
    // ============================================

    function initFormHandlers() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // Add loading state
                const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.value = submitBtn.value || 'Saving...';
                }
            });
        });
    }

    // ============================================
    // 🎨 NOTIFICATION SYSTEM
    // ============================================

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.djze-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'notice notice-' + type + ' djze-notification';
        notification.style.cssText = `
            margin: 10px 0;
            padding: 12px;
            border-left: 4px solid;
            border-radius: 4px;
        `;
        
        const colorMap = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        
        notification.style.borderLeftColor = colorMap[type] || colorMap['info'];
        
        notification.innerHTML = '<p>' + message + '</p>';
        
        // Insert after admin title
        const title = document.querySelector('h1');
        if (title) {
            title.parentNode.insertBefore(notification, title.nextSibling);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.fadeOut();
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Add fadeOut method
    Element.prototype.fadeOut = function() {
        this.style.opacity = '0';
        this.style.transition = 'opacity 0.3s ease';
    };

    // ============================================
    // ⏳ LOADING SPINNER
    // ============================================

    function showLoadingSpinner(message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.id = 'djze-loading-spinner';
        spinner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 30px 50px;
            border-radius: 8px;
            z-index: 9999;
            font-size: 16px;
            text-align: center;
        `;
        spinner.innerHTML = `
            <div style="animation: spin 1s linear infinite; margin-bottom: 10px;">⏳</div>
            <div>${message}</div>
        `;
        
        // Add spinner animation
        if (!document.getElementById('djze-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'djze-spinner-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(spinner);
    }

    function hideLoadingSpinner() {
        const spinner = document.getElementById('djze-loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    // ============================================
    // 📊 UTILITIES
    // ============================================

    // Format date
    window.djzeCspFormatDate = function(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (e) {
            return dateString;
        }
    };

    // Get nonce from page
    window.djzeCspGetNonce = function() {
        const meta = document.querySelector('meta[name="csp-nonce"]');
        return meta ? meta.getAttribute('content') : null;
    };

    // Log info
    window.djzeCspLog = function(message, level = 'log') {
        if (window.console && typeof window.console[level] === 'function') {
            window.console[level]('[DJZ CSP] ' + message);
        }
    };

    // ============================================
    // 🌍 GLOBAL EXPORTS
    // ============================================

    window.djzeCsp = {
        clearLogs: window.djzeCspClearLogs,
        exportLogs: window.djzeCspExportLogs,
        formatDate: window.djzeCspFormatDate,
        getNonce: window.djzeCspGetNonce,
        log: window.djzeCspLog,
        version: window.djzeCspAdmin?.version || '2.5.0'
    };

    console.log('✅ DJ Zen Eyer CSP Admin JS loaded successfully');
})();
