import React, { useState, useEffect, useRef } from 'react';
import { styles } from './styles';

// Функция форматирования даты
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `Сегодня, ${hours}:${minutes}`;
    }

    if (date.toDateString() === tomorrow.toDateString()) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `Завтра, ${hours}:${minutes}`;
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

// Тип записи
interface Appointment {
    id: string;
    date: string;
    clientName: string;
    petName: string;
    // service: string;
    price: number;
    comment: string;
}

// Ключ для localStorage
const STORAGE_KEY = 'groomer_appointments';

function App() {
    // Состояния
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        // Начальное состояние - загрузка из localStorage
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Загружено из localStorage:', parsed);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error);
        }
        return [];
    });

    const [showForm, setShowForm] = useState(false);
    const [showClientHistory, setShowClientHistory] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 16),
        clientName: '',
        petName: '',
        // service: '',
        price: '',
        comment: ''
    });
    const [clientSuggestions, setClientSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const clientInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Сохранение в localStorage при изменении appointments
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
                console.log('Сохранено в localStorage:', appointments);
            } catch (error) {
                console.error('Ошибка сохранения в localStorage:', error);
            }
        }
    }, [appointments, isInitialized]);

    // Устанавливаем флаг инициализации после первого рендера
    useEffect(() => {
        setIsInitialized(true);
    }, []);

    // Обновление списка клиентов для автодополнения
    useEffect(() => {
        const clientNames = [...new Set(appointments.map(app => app.clientName))];
        setClientSuggestions(clientNames.sort());
    }, [appointments]);

    // Закрытие подсказок при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
                clientInputRef.current && !clientInputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Ближайшая запись
    const nearestAppointment = appointments.length > 0
        ? appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
        : null;

    // Получить список всех клиентов
    const getAllClients = () => {
        return clientSuggestions;
    };

    // Получить историю конкретного клиента
    const getClientHistory = (clientName: string) => {
        const clientAppointments = appointments
            .filter(app => app.clientName === clientName)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const totalSpent = clientAppointments
            .reduce((sum, app) => sum + app.price, 0);

        return {
            clientName,
            totalVisits: clientAppointments.length,
            totalSpent,
            appointments: clientAppointments
        };
    };

    // Обработчик изменения имени клиента с автодополнением
    const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({...formData, clientName: value});

        if (value.length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Выбор клиента из подсказок
    const handleClientSelect = (clientName: string) => {
        setFormData({...formData, clientName});
        setShowSuggestions(false);
    };

    // Добавление новой записи
    const handleAddAppointment = (e: React.FormEvent) => {
        e.preventDefault();

        // Проверка обязательных полей
        if (!formData.clientName || !formData.price) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const newAppointment: Appointment = {
            id: editingAppointment ? editingAppointment.id : Date.now().toString(),
            date: formData.date,
            clientName: formData.clientName.trim(),
            petName: formData.petName.trim(),
            // service: formData.service.trim(),
            price: Number(formData.price),
            comment: formData.comment.trim()
        };

        if (editingAppointment) {
            // Редактирование существующей записи
            const updatedAppointments = appointments.map(app =>
                app.id === editingAppointment.id ? newAppointment : app
            );
            setAppointments(updatedAppointments);
            setEditingAppointment(null);
        } else {
            // Добавление новой записи
            setAppointments([...appointments, newAppointment]);
        }

        // Сброс формы
        setFormData({
            date: new Date().toISOString().slice(0, 16),
            clientName: '',
            petName: '',
            // service: '',
            price: '',
            comment: ''
        });

        setShowForm(false);
    };

    // Начало редактирования записи
    const handleEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment);

        // Форматируем дату для input[type="datetime-local"]
        const date = new Date(appointment.date);
        const formattedDate = date.toISOString().slice(0, 16);

        setFormData({
            date: formattedDate,
            clientName: appointment.clientName,
            petName: appointment.petName,
            // service: appointment.service,
            price: appointment.price.toString(),
            comment: appointment.comment
        });
        setShowForm(true);
    };

    // Удалить запись
    const handleDelete = (id: string) => {
        if (window.confirm('Удалить эту запись?')) {
            setAppointments(appointments.filter(app => app.id !== id));
        }
    };

    // Общая статистика
    const totalRevenue = appointments
        .reduce((sum, app) => sum + app.price, 0);

    // Выбранная история клиента
    const selectedClientHistory = selectedClient ? getClientHistory(selectedClient) : null;

    // Фильтр подсказок по введенному тексту
    const filteredSuggestions = clientSuggestions.filter(client =>
        client.toLowerCase().includes(formData.clientName.toLowerCase())
    );

    // Очистить все данные
    // const handleClearAllData = () => {
    //     if (window.confirm('Вы уверены? Это удалит все записи и их нельзя будет восстановить.')) {
    //         localStorage.removeItem(STORAGE_KEY);
    //         setAppointments([]);
    //         alert('Все данные очищены');
    //     }
    // };

    return (
        <div style={styles.container}>
            {/* Заголовок */}
            <header style={styles.header}>
                <h1 style={styles.title}>🐕 Груминг Дневник</h1>

                {appointments.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        {/*<button*/}
                        {/*    onClick={handleClearAllData}*/}
                        {/*    style={{*/}
                        {/*        backgroundColor: '#f44336',*/}
                        {/*        color: 'white',*/}
                        {/*        border: 'none',*/}
                        {/*        padding: '8px 16px',*/}
                        {/*        borderRadius: '6px',*/}
                        {/*        cursor: 'pointer',*/}
                        {/*        fontSize: '14px'*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    🗑️ Очистить все данные*/}
                        {/*</button>*/}
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Записей: {appointments.length} • Клиентов: {getAllClients().length}
                        </p>
                    </div>
                )}
            </header>

            <main style={styles.main}>
                {showClientHistory ? (
                    // Экран истории клиента
                    <div>
                        <button
                            onClick={() => {
                                setShowClientHistory(false);
                                setSelectedClient('');
                            }}
                            style={styles.backButton}
                        >
                            ← Назад
                        </button>

                        <div style={styles.clientStats}>
                            <h2 style={{ marginTop: 0 }}>История клиента: {selectedClient}</h2>
                            {selectedClientHistory && (
                                <div>
                                    <div style={styles.clientStatItem}>
                                        <span>Всего посещений:</span>
                                        <strong>{selectedClientHistory.totalVisits}</strong>
                                    </div>
                                    <div style={styles.clientStatItem}>
                                        <span>Всего потрачено:</span>
                                        <strong>{selectedClientHistory.totalSpent} ₽</strong>
                                    </div>
                                </div>
                            )}
                        </div>

                        <h3>Записи клиента:</h3>
                        {selectedClientHistory && selectedClientHistory.appointments.length > 0 ? (
                            <div style={styles.historyList}>
                                {selectedClientHistory.appointments.map(appointment => (
                                    <div key={appointment.id} style={styles.historyItem}>
                                        <div style={styles.historyHeader}>
                                            {/*<h4 style={styles.historyTitle}>*/}
                                            {/*    {appointment.petName} • {appointment.service}*/}
                                            {/*</h4>*/}
                                        </div>

                                        <div style={styles.historyDetails}>
                                            <span style={styles.historyDate}>{formatDate(appointment.date)}</span>
                                            <span style={styles.historyPrice}>{appointment.price} ₽</span>
                                        </div>

                                        {appointment.comment && (
                                            <div style={styles.historyComment}>
                                                💬 {appointment.comment}
                                            </div>
                                        )}

                                        {/*<div style={styles.historyActions}>*/}
                                        {/*    <button*/}
                                        {/*        onClick={() => handleEdit(appointment)}*/}
                                        {/*        style={styles.smallButton}*/}
                                        {/*    >*/}
                                        {/*        ✏️ Редактировать*/}
                                        {/*    </button>*/}
                                        {/*    <button*/}
                                        {/*        onClick={() => handleDelete(appointment.id)}*/}
                                        {/*        style={styles.deleteButton}*/}
                                        {/*    >*/}
                                        {/*        × Удалить*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={styles.emptyCard}>
                                <p style={styles.emptyText}>У этого клиента пока нет записей</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Главный экран
                    <>
                        {/* Ближайшая запись */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>📅 Ближайшая запись</h2>

                            {nearestAppointment ? (
                                <div style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <h3 style={styles.cardTitle}>{nearestAppointment.clientName}</h3>
                                    </div>

                                    <div style={styles.cardContent}>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Дата:</span>
                                            <span style={styles.infoValue}>{formatDate(nearestAppointment.date)}</span>
                                        </div>

                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Питомец:</span>
                                            <span style={styles.infoValue}>{nearestAppointment.petName}</span>
                                        </div>

                                        {/*<div style={styles.infoRow}>*/}
                                        {/*    <span style={styles.infoLabel}>Услуга:</span>*/}
                                        {/*    <span style={styles.infoValue}>{nearestAppointment.service}</span>*/}
                                        {/*</div>*/}

                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Стоимость:</span>
                                            <span style={{...styles.infoValue, fontWeight: 'bold', color: '#2196F3'}}>
                        {nearestAppointment.price} ₽
                      </span>
                                        </div>

                                        {nearestAppointment.comment && (
                                            <div style={styles.commentBox}>
                                                💬 {nearestAppointment.comment}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        {/*<button*/}
                                        {/*    onClick={() => handleEdit(nearestAppointment)}*/}
                                        {/*    style={{ ...styles.viewHistoryButton, backgroundColor: '#FF9800' }}*/}
                                        {/*>*/}
                                        {/*    ✏️ Редактировать*/}
                                        {/*</button>*/}
                                        <button
                                            onClick={() => {
                                                setSelectedClient(nearestAppointment.clientName);
                                                setShowClientHistory(true);
                                            }}
                                            style={styles.viewHistoryButton}
                                        >
                                            👥 История клиента
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={styles.emptyCard}>
                                    <p style={styles.emptyText}>Нет записей</p>
                                    <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                                        Нажмите "Записать клиента" чтобы добавить первую запись
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Кнопка добавления */}
                        <button
                            onClick={() => {
                                setEditingAppointment(null);
                                setShowForm(true);
                            }}
                            style={styles.addButton}
                        >
                            ➕ Записать клиента
                        </button>

                        {/* Статистика */}
                        <div style={styles.stats}>
                            <div style={styles.statItem}>
                                <span style={styles.statNumber}>{appointments.length}</span>
                                <span style={styles.statLabel}>Всего записей</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statNumber}>{totalRevenue} ₽</span>
                                <span style={styles.statLabel}>Выручка</span>
                            </div>
                            <div style={styles.statItem}>
                                <span style={styles.statNumber}>{getAllClients().length}</span>
                                <span style={styles.statLabel}>Клиентов</span>
                            </div>
                        </div>

                        {/* Форма добавления/редактирования записи */}
                        {showForm && (
                            <div style={styles.overlay}>
                                <div style={styles.formContainer}>
                                    <div style={styles.formHeader}>
                                        <h2 style={styles.formTitle}>
                                            {editingAppointment ? '✏️ Редактировать запись' : 'Новая запись'}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingAppointment(null);
                                            }}
                                            style={styles.closeButton}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={handleAddAppointment} style={styles.form}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Дата и время *</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.date}
                                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                                style={styles.input}
                                                required
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Имя клиента *</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    ref={clientInputRef}
                                                    type="text"
                                                    value={formData.clientName}
                                                    onChange={handleClientNameChange}
                                                    onFocus={() => formData.clientName.length > 0 && setShowSuggestions(true)}
                                                    style={styles.input}
                                                    required
                                                />

                                                {showSuggestions && filteredSuggestions.length > 0 && (
                                                    <div
                                                        ref={suggestionsRef}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            backgroundColor: 'white',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '6px',
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                            zIndex: 1000,
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        {filteredSuggestions.map((client, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => handleClientSelect(client)}
                                                                style={{
                                                                    padding: '10px 15px',
                                                                    cursor: 'pointer',
                                                                    borderBottom: '1px solid #f0f0f0',
                                                                    backgroundColor: formData.clientName === client ? '#f0f7ff' : 'white',
                                                                    color: formData.clientName === client ? '#2196F3' : '#333'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        formData.clientName === client ? '#f0f7ff' : 'white';
                                                                }}
                                                            >
                                                                {client}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {clientSuggestions.length > 0 && (
                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                    Начните вводить имя, чтобы увидеть ранее записанных клиентов
                                                </div>
                                            )}
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Кличка питомца</label>
                                            <input
                                                type="text"
                                                value={formData.petName}
                                                onChange={(e) => setFormData({...formData, petName: e.target.value})}
                                                style={styles.input}
                                            />
                                        </div>

                                        {/*<div style={styles.formGroup}>*/}
                                        {/*    <label style={styles.label}>Услуга *</label>*/}
                                        {/*    <input*/}
                                        {/*        type="text"*/}
                                        {/*        value={formData.service}*/}
                                        {/*        onChange={(e) => setFormData({...formData, service: e.target.value})}*/}
                                        {/*        style={styles.input}*/}
                                        {/*        required*/}
                                        {/*    />*/}
                                        {/*</div>*/}

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Стоимость (₽) *</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                style={styles.input}
                                                placeholder="2000"
                                                required
                                                min="0"
                                                step="100"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Комментарий</label>
                                            <textarea
                                                value={formData.comment}
                                                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                                style={styles.textarea}
                                                placeholder="Заметки о питомце, особенностях и т.д."
                                            />
                                        </div>

                                        <div style={styles.formButtons}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    setEditingAppointment(null);
                                                }}
                                                style={styles.cancelButton}
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                type="submit"
                                                style={styles.submitButton}
                                            >
                                                {editingAppointment ? 'Сохранить изменения' : 'Сохранить'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* История записей */}
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>📋 Последние записи</h2>

                            {appointments.length > 0 ? (
                                <div style={styles.historyList}>
                                    {[...appointments]
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(0, 5)
                                        .map(appointment => (
                                            <div key={appointment.id} style={styles.historyItem}>
                                                <div style={styles.historyHeader}>
                                                    <h4 style={styles.historyTitle}>
                                                        {appointment.clientName} • {appointment.petName}
                                                    </h4>
                                                </div>

                                                <div style={styles.historyDetails}>
                                                    <span style={styles.historyDate}>{formatDate(appointment.date)}</span>
                                                    {/*<span style={styles.historyService}>{appointment.service}</span>*/}
                                                    <span style={styles.historyPrice}>{appointment.price} ₽</span>
                                                </div>

                                                {appointment.comment && (
                                                    <div style={styles.historyComment}>
                                                        💬 {appointment.comment}
                                                    </div>
                                                )}

                                                <div style={styles.historyActions}>
                                                    <button
                                                        onClick={() => handleEdit(appointment)}
                                                        style={{...styles.smallButton, backgroundColor: '#FF9800'}}
                                                    >
                                                        ✏️ Редактировать
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClient(appointment.clientName);
                                                            setShowClientHistory(true);
                                                        }}
                                                        style={styles.smallButton}
                                                    >
                                                        👥 История
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(appointment.id)}
                                                        style={styles.deleteButton}
                                                    >
                                                        × Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div style={styles.emptyCard}>
                                    <p style={styles.emptyText}>Записей пока нет</p>
                                </div>
                            )}
                        </section>
                    </>
                )}

                {/* Модальное окно выбора клиента для истории */}
                {showClientHistory && !selectedClient && (
                    <div style={styles.overlay}>
                        <div style={styles.formContainer}>
                            <div style={styles.formHeader}>
                                <h2 style={styles.formTitle}>История клиента</h2>
                                <button
                                    onClick={() => setShowClientHistory(false)}
                                    style={styles.closeButton}
                                >
                                    ×
                                </button>
                            </div>

                            <p>Выберите клиента для просмотра истории:</p>

                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                style={styles.clientSelect}
                            >
                                <option value="">Выберите клиента...</option>
                                {getAllClients().map(client => (
                                    <option key={client} value={client}>
                                        {client}
                                    </option>
                                ))}
                            </select>

                            <div style={styles.formButtons}>
                                <button
                                    onClick={() => setShowClientHistory(false)}
                                    style={styles.cancelButton}
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedClient) {
                                            setShowClientHistory(true);
                                        }
                                    }}
                                    style={styles.submitButton}
                                    disabled={!selectedClient}
                                >
                                    Показать историю
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer style={styles.footer}>
                <p>© {new Date().getFullYear()} Груминг Дневник • Все записи сохраняются в браузере</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    Данные хранятся локально в вашем браузере
                </p>
            </footer>
        </div>
    );
}

export default App;