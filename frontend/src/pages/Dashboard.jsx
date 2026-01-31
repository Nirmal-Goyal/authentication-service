import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, authAPI } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [uptime, setUptime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const profileRes = await authAPI.getProfile();
                setUser(profileRes.data);

                const statsRes = await dashboardAPI.getStats();
                setStats(statsRes.data.data);

                const uptimeRes = await dashboardAPI.getUptime();
                setUptime(uptimeRes.data.data);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard-container"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="dashboard-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>

            {user && (
                <div className="profile-card">
                    <h2>Profile Information</h2>
                    <div className="profile-info">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>User ID:</strong> {user.id}</p>
                        <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            )}

            <div className="data-cards">
                {stats && (
                    <div className="data-card">
                        <h3>System Statistics</h3>
                        <div className="stat-item">
                            <span>Total Users:</span>
                            <strong>{stats.totalUsers}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Active Users:</span>
                            <strong>{stats.activeUsers}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Login Attempts:</span>
                            <strong>{stats.loginAttempts}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Success Rate:</span>
                            <strong>{stats.successRate}</strong>
                        </div>
                    </div>
                )}

                {uptime && (
                    <div className="data-card">
                        <h3>Server Status</h3>
                        <div className="stat-item">
                            <span>Uptime:</span>
                            <strong>{uptime.uptime}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Status:</span>
                            <strong className="status-healthy">{uptime.status}</strong>
                        </div>
                        <div className="stat-item">
                            <span>Server Time:</span>
                            <strong>{new Date(uptime.server_time).toLocaleTimeString()}</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}