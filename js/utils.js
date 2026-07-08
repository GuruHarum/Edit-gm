function formatCurrentDate() {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const now = new Date();
            const day = days[now.getDay()];
            const date = now.getDate();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            
            return `${day}, ${date} ${month} ${year}`;
}

function getDaysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
}

function parseCSV(csvText) {
            const lines = csvText.split('\n');
            if (lines.length === 0) return [];
            
            const headers = lines[0].split(',').map(header => header.trim());
            
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                let values = [];
                let inQuotes = false;
                let currentValue = '';
                
                for (let j = 0; j < lines[i].length; j++) {
                    const char = lines[i][j];
                    
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        values.push(currentValue);
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                
                values.push(currentValue);
                
                if (values.length !== headers.length) {
                    values = lines[i].split(',');
                }
                
                const entry = {};
                for (let j = 0; j < headers.length; j++) {
                    let value = j < values.length ? values[j] : '';
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    entry[headers[j]] = value.trim();
                }
                
                result.push(entry);
            }
            
            return result;
}
