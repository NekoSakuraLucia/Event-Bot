const fs = require("fs");

class EventManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.loadData();
    }

    loadData() {
        if (!fs.existsSync(this.filePath)) {
            this.events = [];
            this.saveData();
        } else {
            this.events = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        }
    }

    saveData() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.events, null, 2), 'utf-8');
    }

    createEvent(name, description, date) {
        const event = { id: this.events.length + 1, name, description, date, participants: [] };
        this.events.push(event);
        this.saveData();
        return event;
    }

    registerParticipant(eventId, userId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) throw new Error('ไม่พบกิจกรรมนี้');
        if (event.participants.includes(userId)) throw new Error('คุณลงทะเบียนไปแล้ว');
        event.participants.push(userId);
        this.saveData();
        return event;
    }

    getEvents() {
        return this.events;
    }

    getEventById(eventId) {
        return this.events.find(e => e.id === eventId);
    }

    getRandomWinner(eventId) {
        const event = this.getEventById(eventId);
        if (!event || event.participants.length === 0) throw new Error('ไม่มีผู้เข้าร่วมกิจกรรม');
        return event.participants[Math.floor(Math.random() * event.participants.length)];
    }
}

module.exports = EventManager;