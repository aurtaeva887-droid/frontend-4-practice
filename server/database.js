export const database = {
    today: { day: 15, month: 9, year: 2026 }, 
    slots: {
        // Слоты на 15-е число
        "2026-9-15": [
            { time: "10:00", available: true },
            { time: "11:00", available: false },
            { time: "12:00", available: true },
            { time: "13:00", available: true },
            { time: "14:00", available: true },
            { time: "15:00", available: true },
        ],
        // Слоты на 16-е число
        "2026-9-16": [
            { time: "09:00", available: true },
            { time: "10:00", available: true },
            { time: "11:00", available: true },
            { time: "12:00", available: false },
            { time: "13:00", available: true },
        ],
        // Слоты на 17-е число
        "2026-9-17": [
            { time: "14:00", available: true },
            { time: "15:00", available: true },
            { time: "16:00", available: true },
            { time: "17:00", available: true },
        ]
    }
};