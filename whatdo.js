class ConnectionMap {
            constructor() {
                this.svg = document.getElementById('connections');
                this.items = document.querySelectorAll('.item');
                this.pathwaySentence = document.getElementById('pathway-sentence');
                this.activeConnections = new Set();
                
                this.init();
            }

            init() {
                this.drawAllConnections();
                this.attachEventListeners();
                this.handleResize();
            }

            drawAllConnections() {
                // Clear existing lines
                this.svg.innerHTML = '';

                // Keep track of connections we've already drawn to avoid duplicates
                const drawn = new Set();

                this.items.forEach(item => {
                    const connections = item.dataset.connections?.split(',') || [];
                    connections.forEach(targetId => {
                        targetId = targetId.trim();
                        if (!targetId) return;

                        // Create a unique key for this connection, order-independent
                        const key = [item.id, targetId].sort().join('|');

                        if (!drawn.has(key)) {
                            this.drawConnection(item.id, targetId);
                            drawn.add(key);
                        }
                    });
                });
            }

            drawConnection(fromId, toId) {
                const fromElement = document.getElementById(fromId);
                const toElement = document.getElementById(toId);
                
                if (!fromElement || !toElement) return;

                const fromRect = fromElement.getBoundingClientRect();
                const toRect = toElement.getBoundingClientRect();
                const containerRect = this.svg.getBoundingClientRect();

                const startX = fromRect.left + fromRect.width/2 - containerRect.left;
                const startY = fromRect.top + fromRect.height/2 - containerRect.top;
                const endX = toRect.left + toRect.width/2 - containerRect.left;
                const endY = toRect.top + toRect.height/2 - containerRect.top;

                // Create curved line using quadratic curve
                const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 60; // Add some curve variation
                const midY = (startY + endY) / 2 - Math.abs(endY - startY) * 0.2; // Curve between items

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                line.setAttribute('d', `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`);
                line.setAttribute('class', 'connection-line');
                line.setAttribute('data-from', fromId);
                line.setAttribute('data-to', toId);
                line.setAttribute('fill', 'none');

                this.svg.appendChild(line);
            }

            attachEventListeners() {
                this.items.forEach(item => {
                    item.addEventListener('click', (e) => {
                        this.handleItemClick(e.target);
                    });

                    item.addEventListener('mouseenter', (e) => {
                        if (!document.querySelector('.item.highlighted')) {
                            this.highlightConnections(e.target, true);
                        }
                    });

                    item.addEventListener('mouseleave', (e) => {
                        if (!document.querySelector('.item.highlighted')) {
                            this.clearHighlight();
                        }
                    });
                });

                // Click outside to clear selection
                document.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('item')) {
                        this.clearHighlight();
                    }
                });

                window.addEventListener('resize', () => {
                    setTimeout(() => this.drawAllConnections(), 100);
                });
            }

            handleItemClick(item) {
                const isHighlighted = item.classList.contains('highlighted');
                
                this.clearHighlight();
                
                if (!isHighlighted) {
                    this.highlightConnections(item);
                    this.updatePathwaySentence(item);
                } else {
                    this.resetPathwaySentence();
                }
            }

            highlightConnections(item, isHover = false) {
            const connections = item.dataset.connections?.split(',') || [];

            // Highlight the clicked/hovered item
            item.classList.add(isHover ? 'connected' : 'highlighted');

            // Highlight all items that connect to or from this item
            this.items.forEach(other => {
                const otherConnections = other.dataset.connections?.split(',') || [];
                if (connections.includes(other.id) || otherConnections.includes(item.id)) {
                    other.classList.add('connected');
                }
            });

            // Highlight connection lines
            const lines = this.svg.querySelectorAll('.connection-line');
            lines.forEach(line => {
                const from = line.getAttribute('data-from');
                const to = line.getAttribute('data-to');

                if (from === item.id || to === item.id) {
                    line.classList.add('active');
                }
            });
        }


            clearHighlight() {
                // Remove all highlight classes
                this.items.forEach(item => {
                    item.classList.remove('highlighted', 'connected');
                });

                // Remove active lines
                const lines = this.svg.querySelectorAll('.connection-line');
                lines.forEach(line => {
                    line.classList.remove('active');
                });

                this.resetPathwaySentence();
            }

            updatePathwaySentence(clickedItem) {
                const clickedText = clickedItem.textContent;
                const columnId = clickedItem.closest('.column').id;
                
                // Get ALL connected items (both directions)
                let allConnectedItems = new Set();
                
                // Direct connections from clicked item
                const connections = clickedItem.dataset.connections?.split(',') || [];
                connections.forEach(targetId => {
                    const targetElement = document.getElementById(targetId.trim());
                    if (targetElement) {
                        allConnectedItems.add(targetElement);
                    }
                });
                
                // Reverse connections - items that connect TO this item
                this.items.forEach(item => {
                    if (item === clickedItem) return;
                    const itemConnections = item.dataset.connections?.split(',') || [];
                    if (itemConnections.includes(clickedItem.id)) {
                        allConnectedItems.add(item);
                    }
                });
                
                // Sort connected items by category
                let languages = [];
                let tools = [];
                let applications = [];
                
                allConnectedItems.forEach(item => {
                    const itemColumn = item.closest('.column').id;
                    const itemText = item.textContent;
                    
                    if (itemColumn === 'col-a') languages.push(itemText);
                    else if (itemColumn === 'col-b') tools.push(itemText);
                    else if (itemColumn === 'col-c') applications.push(itemText);
                });
                
                // Add the clicked item to its appropriate category
                if (columnId === 'col-a') languages.push(clickedText);
                else if (columnId === 'col-b') tools.push(clickedText);
                else if (columnId === 'col-c') applications.push(clickedText);
                
                // Build the sentence ALWAYS in format: I use {language} in {tool} to do {application}
                if (languages.length > 0 && tools.length > 0 && applications.length > 0) {
                    const lang = languages[Math.floor(Math.random() * languages.length)];
                    const tool = tools[Math.floor(Math.random() * tools.length)];
                    const app = applications[Math.floor(Math.random() * applications.length)];
                    
                    const sentence = `I use <strong>${lang}</strong> in <strong>${tool}</strong> to do <strong>${app}</strong>.`;
                    this.pathwaySentence.innerHTML = sentence;
                    this.pathwaySentence.style.color = '#059669';
                } else {
                    // Fallback if we can't make a complete sentence
                    const allConnectedTexts = Array.from(allConnectedItems).map(item => item.textContent);
                    this.pathwaySentence.innerHTML = `<strong>${clickedText}</strong> connects to: ${allConnectedTexts.join(', ')}`;
                    this.pathwaySentence.style.color = '#7c3aed';
                }
            }

            resetPathwaySentence() {
                this.pathwaySentence.innerHTML = 'Click on any skill to see how I use it!';
                this.pathwaySentence.style.color = '#475569';
            }

            handleResize() {
                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        this.drawAllConnections();
                    }, 250);
                });
            }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ConnectionMap();
        });