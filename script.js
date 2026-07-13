document.addEventListener('DOMContentLoaded', () => {
    // 1. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });

    // 2. Video Player Placeholders Interaction
    const handleVideoTrigger = (triggerId, videoId, message) => {
        const trigger = document.getElementById(triggerId);
        const video = document.getElementById(videoId);
        
        if (trigger && video) {
            trigger.addEventListener('click', () => {
                // If a source is set in the future, play the video.
                // Otherwise, show a premium-looking alert to help the developer.
                const videoSource = video.querySelector('source');
                if (videoSource && videoSource.src && !videoSource.src.endsWith('#') && videoSource.src !== window.location.href) {
                    trigger.style.display = 'none';
                    video.style.display = 'block';
                    video.play().catch(err => {
                        console.log("Autoplay blocked or video error:", err);
                    });
                } else {
                    // Visual feedback for the owner (since they said they will produce the video)
                    showNoticeModal(message);
                }
            });
        }
    };

    handleVideoTrigger(
        'play-video-trigger', 
        'sales-video', 
        '<strong>Vídeo de Vendas (Placeholder)</strong><br><br>Este player está configurado e pronto! Quando você produzir o seu vídeo de vendas, basta salvar o arquivo (ex: <code>vendas.mp4</code>) na pasta e definir o <code>src</code> da tag <code>&lt;source&gt;</code> no arquivo <code>index.html</code>.'
    );

    handleVideoTrigger(
        'play-tutorial-trigger', 
        'tutorial-video', 
        '<strong>Vídeo de Instrução (Placeholder)</strong><br><br>Quando você produzir o vídeo de instrução da instalação do Deemix, adicione o arquivo de vídeo à pasta do projeto (ex: <code>tutorial.mp4</code>) e configure a tag <code>&lt;source&gt;</code> correspondente no arquivo <code>obrigado.html</code>.'
    );

    // 2.5. Purchase Button Session Authorization
    const buyCtaBtn = document.getElementById('buy-cta-btn');
    if (buyCtaBtn) {
        buyCtaBtn.addEventListener('click', () => {
            sessionStorage.setItem('mdpro_purchased', 'true');
        });
    }

    // 3. Custom sleek notification modal instead of simple browser alert
    function showNoticeModal(htmlContent) {
        // Check if modal already exists
        let modal = document.getElementById('notice-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'notice-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(8, 9, 12, 0.9);
                backdrop-filter: blur(8px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const card = document.createElement('div');
            card.style.cssText = `
                background: #12161f;
                border: 1px solid rgba(0, 200, 0, 0.3);
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 200, 0, 0.15);
                transform: translateY(20px);
                transition: transform 0.3s ease;
            `;
            
            const content = document.createElement('div');
            content.id = 'notice-modal-content';
            content.style.cssText = `
                color: #e2e8f0;
                font-family: 'Outfit', sans-serif;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 24px;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'ENTENDIDO';
            closeBtn.style.cssText = `
                background: linear-gradient(135deg, #00c800 0%, #00a000 100%);
                color: #000000;
                border: none;
                padding: 12px 30px;
                font-size: 14px;
                font-weight: 700;
                border-radius: 10px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                transition: all 0.2s ease;
            `;
            
            closeBtn.addEventListener('mouseover', () => {
                closeBtn.style.transform = 'translateY(-2px)';
                closeBtn.style.boxShadow = '0 6px 20px rgba(0, 200, 0, 0.4)';
            });
            closeBtn.addEventListener('mouseout', () => {
                closeBtn.style.transform = 'translateY(0)';
                closeBtn.style.boxShadow = 'none';
            });
            
            closeBtn.addEventListener('click', () => {
                modal.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
            
            card.appendChild(content);
            card.appendChild(closeBtn);
            modal.appendChild(card);
            document.body.appendChild(modal);
        }
        
        const modalContent = document.getElementById('notice-modal-content');
        modalContent.innerHTML = htmlContent;
        
        modal.style.display = 'flex';
        // Trigger reflow
        modal.offsetHeight;
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'translateY(0)';
    }

    // 4. Analytics Tracking System (localStorage-based)
    const isLoginPageOrAdmin = window.location.pathname.toLowerCase().includes('admin');
    
    // Only track if it's not the admin page itself (to avoid polluting stats)
    if (!isLoginPageOrAdmin) {
        let activeSessionId = sessionStorage.getItem('mdpro_active_session');
        let sessions = JSON.parse(localStorage.getItem('mdpro_sessions') || '[]');
        let totalVisits = parseInt(localStorage.getItem('mdpro_total_visits') || '0', 10);
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!activeSessionId) {
            // New session!
            activeSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem('mdpro_active_session', activeSessionId);
            
            totalVisits += 1;
            localStorage.setItem('mdpro_total_visits', totalVisits.toString());
            
            const newSession = {
                id: activeSessionId,
                startTime: Date.now(),
                endTime: Date.now(),
                durationSeconds: 0,
                pagesVisited: [currentPage],
                ip: 'Obtendo IP...'
            };
            
            sessions.push(newSession);
            localStorage.setItem('mdpro_sessions', JSON.stringify(sessions));
        } else {
            // Existing session - find it and update pages
            const currentSession = sessions.find(s => s.id === activeSessionId);
            if (currentSession) {
                if (!currentSession.pagesVisited.includes(currentPage)) {
                    currentSession.pagesVisited.push(currentPage);
                    localStorage.setItem('mdpro_sessions', JSON.stringify(sessions));
                }
            }
        }
        
        // Fetch IP address from public API to track unique visits by IP
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const userIp = data.ip || 'IP Desconhecido';
                
                // Track unique IPs
                let uniqueIps = JSON.parse(localStorage.getItem('mdpro_unique_ips') || '[]');
                if (!uniqueIps.includes(userIp) && userIp !== 'IP Desconhecido') {
                    uniqueIps.push(userIp);
                    localStorage.setItem('mdpro_unique_ips', JSON.stringify(uniqueIps));
                }
                
                // Attach IP to active session in sessions list
                let currentSessions = JSON.parse(localStorage.getItem('mdpro_sessions') || '[]');
                const activeSess = currentSessions.find(s => s.id === activeSessionId);
                if (activeSess) {
                    activeSess.ip = userIp;
                    localStorage.setItem('mdpro_sessions', JSON.stringify(currentSessions));
                }
            })
            .catch(err => {
                console.error("Erro ao obter IP:", err);
            });
        
        // Heartbeat timer to track active time on page (runs every second)
        setInterval(() => {
            let currentSessions = JSON.parse(localStorage.getItem('mdpro_sessions') || '[]');
            const activeSess = currentSessions.find(s => s.id === activeSessionId);
            if (activeSess) {
                activeSess.durationSeconds += 1;
                activeSess.endTime = Date.now();
                localStorage.setItem('mdpro_sessions', JSON.stringify(currentSessions));
            }
        }, 1000);
    }

    // 5. Admin Panel Logic (if on admin.html)
    if (isLoginPageOrAdmin) {
        const loginSection = document.getElementById('admin-login-section');
        const dashboardSection = document.getElementById('admin-dashboard-section');
        const passwordInput = document.getElementById('admin-password');
        const loginBtn = document.getElementById('admin-login-btn');
        const loginError = document.getElementById('admin-login-error');
        
        const correctPassword = '366724eA';
        
        const checkAuth = () => {
            if (sessionStorage.getItem('mdpro_admin_logged') === 'true') {
                if (loginSection) loginSection.style.display = 'none';
                if (dashboardSection) dashboardSection.style.display = 'block';
                loadDashboardData();
                startDashboardUpdates();
            } else {
                if (loginSection) loginSection.style.display = 'flex';
                if (dashboardSection) dashboardSection.style.display = 'none';
            }
        };
        
        const handleLogin = () => {
            if (passwordInput && passwordInput.value.trim() === correctPassword) {
                sessionStorage.setItem('mdpro_admin_logged', 'true');
                if (loginError) loginError.style.display = 'none';
                passwordInput.value = '';
                checkAuth();
            } else if (passwordInput) {
                if (loginError) {
                    loginError.style.display = 'block';
                    loginError.innerText = 'Senha incorreta. Tente novamente.';
                }
                passwordInput.classList.add('shake');
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
            }
        };
        
        if (loginBtn) {
            loginBtn.addEventListener('click', handleLogin);
            if (passwordInput) {
                passwordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleLogin();
                });
            }
        }
        
        // Load stats into Dashboard UI
        const loadDashboardData = () => {
            const totalVisits = localStorage.getItem('mdpro_total_visits') || '0';
            const sessions = JSON.parse(localStorage.getItem('mdpro_sessions') || '[]');
            const uniqueIpsList = JSON.parse(localStorage.getItem('mdpro_unique_ips') || '[]');
            const totalUniqueIps = uniqueIpsList.length;
            
            // Calculate total time & average time
            let totalSeconds = 0;
            sessions.forEach(s => {
                totalSeconds += s.durationSeconds || 0;
            });
            
            const avgSeconds = sessions.length > 0 ? Math.round(totalSeconds / sessions.length) : 0;
            
            // Active users in the last 15 seconds
            const now = Date.now();
            const activeUsersCount = sessions.filter(s => (now - s.endTime) < 15000 && s.durationSeconds > 0).length;
            
            // Update counts in DOM
            const visitsEl = document.getElementById('stat-total-visits');
            const uniqueIpsEl = document.getElementById('stat-unique-ips');
            const totalTimeEl = document.getElementById('stat-total-time');
            const avgTimeEl = document.getElementById('stat-avg-time');
            const activeUsersEl = document.getElementById('stat-active-users');
            
            if (visitsEl) visitsEl.innerText = totalVisits;
            if (uniqueIpsEl) uniqueIpsEl.innerText = totalUniqueIps.toString();
            if (totalTimeEl) totalTimeEl.innerText = formatDuration(totalSeconds);
            if (avgTimeEl) avgTimeEl.innerText = formatDuration(avgSeconds);
            if (activeUsersEl) activeUsersEl.innerText = activeUsersCount.toString();
            
            // Render recent sessions table
            const tableBody = document.getElementById('sessions-table-body');
            if (tableBody) {
                tableBody.innerHTML = '';
                if (sessions.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma visita registrada ainda.</td></tr>`;
                } else {
                    // Show last 10 sessions, newest first
                    const reversedSessions = [...sessions].reverse().slice(0, 10);
                    reversedSessions.forEach((s) => {
                        const dateStr = new Date(s.startTime).toLocaleString('pt-BR');
                        const pagesStr = s.pagesVisited.join(', ');
                        const ipDisplay = s.ip || 'Carregando IP...';
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${dateStr}</td>
                            <td style="padding: 12px; border-bottom: 1px solid var(--border-color);"><strong>${ipDisplay}</strong> <span style="font-size:11px; opacity:0.5;">(${s.id.substring(5, 12)})</span></td>
                            <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${pagesStr}</td>
                            <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${formatDuration(s.durationSeconds)}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            }
        };
        
        // Helper to format seconds to readable format
        const formatDuration = (seconds) => {
            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            const remainingSecs = seconds % 60;
            if (minutes < 60) return `${minutes}m ${remainingSecs}s`;
            const hours = Math.floor(minutes / 60);
            const remainingMins = minutes % 60;
            return `${hours}h ${remainingMins}m`;
        };
        
        let updateInterval;
        const startDashboardUpdates = () => {
            clearInterval(updateInterval);
            updateInterval = setInterval(loadDashboardData, 2000); // refresh every 2 seconds
        };
        
        // Logout & Reset action links
        const logoutBtn = document.getElementById('admin-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('mdpro_admin_logged');
                clearInterval(updateInterval);
                checkAuth();
            });
        }
        
        const resetBtn = document.getElementById('admin-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja zerar TODAS as estatísticas de visitas, IPs e tempo?')) {
                    localStorage.removeItem('mdpro_total_visits');
                    localStorage.removeItem('mdpro_sessions');
                    localStorage.removeItem('mdpro_unique_ips');
                    loadDashboardData();
                }
            });
        }
        
        checkAuth();
    }
});

