import React, { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from './api';
import './App.css';

const MONTHS_NOMINATIVE = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const MONTHS_GENITIVE = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const DAYS_OF_WEEK = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

function App() {
    const [today, setToday] = useState(null);
    const [slots, setSlots] = useState([]);
    
    const [loadingToday, setLoadingToday] = useState(true);
    const [errorToday, setErrorToday] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Загрузка "сегодня"
    useEffect(() => {
        fetchToday()
            .then(data => {
                setToday(data);
                setCurrentMonth(data.month);
                setCurrentYear(data.year);
                setSelectedDay(data.day);
                setLoadingToday(false);
            })
            .catch(err => {
                setErrorToday(err.message);
                setLoadingToday(false);
            });
    }, []);

    // Загрузка слотов при смене дня
    useEffect(() => {
        if (selectedDay === null) return;

        setLoadingSlots(true);
        setSelectedTime(null);

        fetchSlots(selectedDay, currentMonth, currentYear)
            .then(data => {
                if (String(data.date.day) === String(selectedDay) && String(data.date.month) === String(currentMonth)) {
                    setSlots(data.slots || []);
                }
                setLoadingSlots(false);
            })
            .catch(err => {
                setLoadingSlots(false);
            });
    }, [selectedDay, currentMonth, currentYear]);

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const renderCalendarDays = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1);
        let startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        const days = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="day day--disabled"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            // Защита прошлых дней (если это текущий месяц и год)
            let isDisabled = false;
            if (currentYear === today.year && currentMonth === today.month) {
                if (day < today.day) isDisabled = true;
            }

            let className = "day";
            if (selectedDay === day) className += " day--selected";
            if (isDisabled) className += " day--disabled";

            days.push(
                <button
                    key={day}
                    className={className}
                    disabled={isDisabled}
                    onClick={() => handleDayClick(day)}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const renderBottomBar = () => {
        if (selectedDay === null) return "Выберите дату";
        const date = new Date(currentYear, currentMonth, selectedDay);
        const dayName = DAYS_OF_WEEK[date.getDay()];
        const monthName = MONTHS_GENITIVE[currentMonth];
        let text = `${dayName}, ${selectedDay} ${monthName} ${currentYear}`;
        if (selectedTime) text += ` • ${selectedTime}`;
        return text;
    };

    if (loadingToday) return <div className="loading-message" style={{marginTop: '50px'}}>Загрузка данных...</div>;
    if (errorToday) return <div className="error-message" style={{marginTop: '50px'}}>Ошибка: {errorToday}</div>;

    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <h1 style={{ marginBottom: '20px' }}>Выберите дату и время</h1>

            <div className="booking-layout">
                <section className="card">
                    <h2 style={{ marginBottom: '20px' }}>{MONTHS_NOMINATIVE[currentMonth]} {currentYear}</h2>
                    <div className="calendar-grid">
                        <div className="weekday">Пн</div><div className="weekday">Вт</div>
                        <div className="weekday">Ср</div><div className="weekday">Чт</div>
                        <div className="weekday">Пт</div><div className="weekday">Сб</div>
                        <div className="weekday">Вс</div>
                        {renderCalendarDays()}
                    </div>
                </section>

                <section className="card">
                    <h2 style={{ marginBottom: '20px' }}>Доступное время</h2>
                    {loadingSlots ? (
                        <p className="loading-message">Загрузка слотов...</p>
                    ) : slots.length === 0 ? (
                        <p className="loading-message">Нет доступного времени</p>
                    ) : (
                        <div className="time-grid">
                            {slots.map((slot) => (
                                <button
                                    key={slot.time}
                                    className={`time-slot ${selectedTime === slot.time ? 'time-slot--selected' : ''}`}
                                    disabled={!slot.available}
                                    style={!slot.available ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    onClick={() => setSelectedTime(slot.time)}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <div className="bottom-bar">
                {renderBottomBar()}
            </div>
        </div>
    );
}

export default App;