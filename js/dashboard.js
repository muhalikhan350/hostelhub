// ============================================
// HostelHub - Dashboard JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initRevenueChart();
  initOccupancyChart();
});

function initRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [32000, 35000, 38000, 42000, 45000, 48200],
        borderColor: '#4f46e5',
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => '$' + context.parsed.y.toLocaleString()
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          border: { display: false },
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 11 },
            callback: (value) => '$' + (value / 1000) + 'k'
          }
        }
      }
    }
  });
}

function initOccupancyChart() {
  const ctx = document.getElementById('occupancyChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Available', 'Maintenance'],
      datasets: [{
        data: [87, 10, 3],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: { size: 11 },
            color: '#64748b'
          }
        }
      }
    }
  });
}
