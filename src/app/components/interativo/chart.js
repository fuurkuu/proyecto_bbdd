'use client';

import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function ChartElement({chartData}) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const max = Math.max(...chartData.values); 
    
    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            // Define gradient for bar background
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, '#DB1515');
            gradient.addColorStop(1, '#9E0B0F');
            
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Inversión mensual',
                        data: chartData.values,
                        backgroundColor: gradient,
                        borderColor: '#DB1515',
                        borderWidth: 1,
                        borderRadius: 4,
                        hoverBackgroundColor: '#DB1515'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: max + 1000,
                            ticks: {
                                stepSize: 200,
                                font: {
                                    family: "'Geist', sans-serif",
                                    size: 10
                                },
                                color: '#6B7280'
                            },
                            grid: {
                                color: 'rgba(107, 114, 128, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: "'Geist', sans-serif",
                                    size: 10,
                                    weight: 'bold'
                                },
                                color: '#6B7280'
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#DB1515',
                            titleFont: {
                                family: "'Geist', sans-serif",
                                size: 12,
                                weight: 'bold'
                            },
                            bodyFont: {
                                family: "'Geist', sans-serif",
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 4,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y + '€';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData]);

    return (
        <canvas ref={chartRef}></canvas>
    );
}