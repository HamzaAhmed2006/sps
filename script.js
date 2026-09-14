$(function () {

    var $sidebar = $('#sidebar');
    var $overlay = $('#sidebarOverlay');

    // Sidebar toggle
    $('#sidebarToggle').on('click', function () {
        if ($(window).width() <= 992) {
            $sidebar.toggleClass('mobile-open');
            $overlay.toggleClass('visible');
        } else {
            $sidebar.toggleClass('collapsed');
        }
    });

    $overlay.on('click', function () {
        $sidebar.removeClass('mobile-open');
        $overlay.removeClass('visible');
    });

    $(window).on('resize', function () {
        if ($(window).width() <= 992) {
            $sidebar.removeClass('collapsed mobile-open');
            $overlay.removeClass('visible');
        }
    });

    // Nav links
    $('.nav-link-item').on('click', function (e) {
        e.preventDefault();
        $('.nav-link-item').removeClass('active');
        $(this).addClass('active');
    });

    // Theme toggle
    $('#themeToggle').on('click', function () {
        var html = $('html');
        var icon = $(this).find('i');
        if (html.attr('data-theme') === 'dark') {
            html.attr('data-theme', 'light');
            icon.removeClass('bi-moon-stars-fill').addClass('bi-sun-fill');
        } else {
            html.attr('data-theme', 'dark');
            icon.removeClass('bi-sun-fill').addClass('bi-moon-stars-fill');
        }
    });

    // Quick Actions FAB
    $('#qaTrigger').on('click', function () {
        $('#quickActions').toggleClass('open');
    });

    // Close quick actions when clicking outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#quickActions').length) {
            $('#quickActions').removeClass('open');
        }
    });

    // Counter animation
    function runCounters() {
        $('.kpi-value').each(function () {
            var el = $(this);
            var target = parseFloat(el.data('count'));
            var pre = el.data('prefix') || '';
            var suf = el.data('suffix') || '';
            var dec = el.data('decimal') === true;
            var dur = 1800;
            var t0 = performance.now();

            (function tick(now) {
                var p = Math.min((now - t0) / dur, 1);
                var ease = 1 - Math.pow(1 - p, 3);
                var val = target * ease;

                el.text(pre + (dec ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suf);

                if (p < 1) requestAnimationFrame(tick);
                else el.text(pre + (dec ? target.toFixed(1) : Math.floor(target).toLocaleString()) + suf);
            })(t0);
        });
    }

    var cObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                runCounters();
                cObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    var firstCard = document.querySelector('.kpi-card');
    if (firstCard) cObserver.observe(firstCard);

    // ===== Chart.js Global Defaults =====
    Chart.defaults.color = '#8899aa';
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
    Chart.defaults.plugins.legend.labels.padding = 20;

    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 25, 38, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#eef2f7';
    Chart.defaults.plugins.tooltip.bodyColor = '#b0c0d0';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(245, 158, 11, 0.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 12;
    Chart.defaults.plugins.tooltip.padding = 14;
    Chart.defaults.plugins.tooltip.displayColors = true;
    Chart.defaults.plugins.tooltip.boxPadding = 6;

    var gridClr = 'rgba(255, 255, 255, 0.04)';
    var tickClr = '#556677';

    // ===== Revenue Line Chart =====
    var revCtx = document.getElementById('revenueChart');
    if (revCtx) {
        var g1 = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        g1.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
        g1.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

        var g2 = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        g2.addColorStop(0, 'rgba(20, 184, 166, 0.18)');
        g2.addColorStop(1, 'rgba(20, 184, 166, 0.0)');

        new Chart(revCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'This Year',
                    data: [4200, 5800, 4900, 7200, 6100, 8400, 7800, 9200, 8700, 10500, 9800, 11200],
                    borderColor: '#f59e0b',
                    backgroundColor: g1,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.45,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#f59e0b',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }, {
                    label: 'Last Year',
                    data: [3100, 4200, 3800, 5100, 4600, 6200, 5800, 7100, 6400, 8000, 7500, 8900],
                    borderColor: '#14b8a6',
                    backgroundColor: g2,
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: true,
                    tension: 0.45,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#14b8a6',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: {
                        grid: { color: gridClr, drawBorder: false },
                        ticks: { color: tickClr, font: { size: 11 } },
                        border: { display: false }
                    },
                    y: {
                        grid: { color: gridClr, drawBorder: false },
                        ticks: {
                            color: tickClr,
                            font: { size: 11 },
                            callback: function (v) { return '$' + (v / 1000).toFixed(0) + 'k'; }
                        },
                        border: { display: false },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: { position: 'top', align: 'end', labels: { font: { size: 11, weight: 500 } } },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) { return ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString(); }
                        }
                    }
                }
            }
        });
    }

    // ===== Sales Doughnut Chart =====
    var salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'],
                datasets: [{
                    data: [35, 25, 18, 14, 8],
                    backgroundColor: ['#f59e0b', '#14b8a6', '#fb923c', '#8b5cf6', '#ef4444'],
                    borderColor: 'rgba(15, 25, 38, 0.85)',
                    borderWidth: 3,
                    hoverOffset: 10,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 11, weight: 500 },
                            padding: 16,
                            generateLabels: function (chart) {
                                var d = chart.data;
                                return d.labels.map(function (lbl, i) {
                                    return {
                                        text: lbl + ' (' + d.datasets[0].data[i] + '%)',
                                        fillStyle: d.datasets[0].backgroundColor[i],
                                        strokeStyle: 'transparent',
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) { return ctx.label + ': ' + ctx.parsed + '%'; }
                        }
                    }
                }
            }
        });
    }

    // ===== Traffic Bar Chart =====
    var trafCtx = document.getElementById('trafficChart');
    if (trafCtx) {
        new Chart(trafCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Organic',
                    data: [1200, 1500, 1100, 1800, 1400, 900, 700],
                    backgroundColor: '#f59e0b',
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }, {
                    label: 'Direct',
                    data: [800, 950, 750, 1100, 900, 600, 450],
                    backgroundColor: '#14b8a6',
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }, {
                    label: 'Referral',
                    data: [400, 550, 380, 650, 520, 350, 280],
                    backgroundColor: '#8b5cf6',
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: tickClr, font: { size: 11 } },
                        border: { display: false }
                    },
                    y: {
                        grid: { color: gridClr, drawBorder: false },
                        ticks: {
                            color: tickClr,
                            font: { size: 11 },
                            callback: function (v) { return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v; }
                        },
                        border: { display: false },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: { position: 'top', align: 'end', labels: { font: { size: 11, weight: 500 } } }
                }
            }
        });
    }

    // ===== Performance Radar Chart =====
    var perfCtx = document.getElementById('performanceChart');
    if (perfCtx) {
        new Chart(perfCtx, {
            type: 'radar',
            data: {
                labels: ['Speed', 'Reliability', 'Satisfaction', 'Engagement', 'Retention', 'Growth'],
                datasets: [{
                    label: 'Current',
                    data: [85, 78, 92, 74, 88, 80],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    borderWidth: 2,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1.5,
                    pointRadius: 4,
                    pointHoverRadius: 7
                }, {
                    label: 'Target',
                    data: [90, 85, 95, 82, 90, 88],
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.08)',
                    borderWidth: 2,
                    borderDash: [5, 3],
                    pointBackgroundColor: '#14b8a6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1.5,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        pointLabels: { color: '#8899aa', font: { size: 11, weight: 500 } },
                        ticks: { display: false, stepSize: 20 },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: { position: 'top', align: 'end', labels: { font: { size: 11, weight: 500 } } },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.r + '%'; }
                        }
                    }
                }
            }
        });
    }

    // Chart period buttons
    $('.chart-period-btn').on('click', function () {
        $(this).siblings('.chart-period-btn').removeClass('active');
        $(this).addClass('active');
    });

    // Bootstrap tooltips
    $('[data-bs-toggle="tooltip"]').each(function () {
        new bootstrap.Tooltip(this);
    });

    // Scroll animations
    var animObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                $(e.target).addClass('animate-in');
                animObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.chart-card, .data-table-card, .activity-card').forEach(function (el) {
        animObs.observe(el);
    });

});
