async function saveAttendanceXHR(studentName, status, note, studentClass) {
            showLoading('Menyimpan data absensi...');
            addDebugLog('Saving attendance with XHR', { studentName, status, note });
            
            const today = formatDateForStorage();
            const record = {
                date: today,
                teacher: selectedTeacher,
                class: studentClass,
                student: studentName,
                status: status,
                note: note || ''
            };
            
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('action', 'saveAttendance');
                for (const [key, value] of Object.entries(record)) {
                    formData.append(key, value);
                }
                
                xhr.open('POST', SCRIPT_URL, true);
                
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        attendanceData.push(record);
                        addDebugLog('XHR Attendance saved successfully', record);
                        hideLoading();
                        resolve(true);
                    } else {
                        addDebugLog('XHR Error saving attendance', xhr.responseText);
                        hideLoading();
                        resolve(false);
                    }
                };
                
                xhr.onerror = function() {
                    addDebugLog('XHR Network error saving attendance');
                    hideLoading();
                    resolve(false);
                };
                
                xhr.send(formData);
            });
        }

async function saveAttendance(studentName, status, note, studentClass) {
            showLoading('Menyimpan data absensi...');
            addDebugLog('Saving attendance', { studentName, status, note });
            
            const today = formatDateForStorage();
            const record = {
                date: today,
                teacher: selectedTeacher,
                class: studentClass,
                student: studentName,
                status: status,
                note: note || ''
            };
            
            try {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = SCRIPT_URL;
                form.target = 'hidden-iframe';
                form.style.display = 'none';
              
                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = 'saveAttendance';
                form.appendChild(actionInput);
                
                for (const [key, value] of Object.entries(record)) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                }
                
                let iframe = document.getElementById('hidden-iframe');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.name = 'hidden-iframe';
                    iframe.id = 'hidden-iframe';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }
                
                document.body.appendChild(form);
                
                const submissionPromise = new Promise((resolve) => {
                    iframe.onload = () => {
                        resolve(true);
                    };
                    
                    setTimeout(() => {
                        resolve(true);
                    }, 3000);
                });
                
                form.submit();
                
                await submissionPromise;
                
                document.body.removeChild(form);
                
                attendanceData.push(record);
                
                addDebugLog('Attendance saved successfully', record);
                hideLoading();
                return true;
            } catch (error) {
                console.error('Error saving attendance:', error);
                addDebugLog('Error saving attendance', error.toString());
                hideLoading();
                return false;
            }
        }
