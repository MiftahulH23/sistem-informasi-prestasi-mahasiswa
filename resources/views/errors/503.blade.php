<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>System Under Maintenance</title>
    @vite(['resources/css/app.css']) {{-- Pastikan Tailwind terhubung --}}
    <style>
        .characters {
            position: absolute;
            width: 18%;
            height: 18%;
        }
    </style>
</head>
<body class="w-full h-screen bg-black overflow-x-hidden flex justify-center items-center relative">

    {{-- Message Display --}}
    <div class="absolute flex flex-col justify-center items-center w-[90%] h-[90%] z-[100] animate-fade-in">
        <div class="flex flex-col items-center opacity-100 transition-opacity duration-500">
            <div class="text-[35px] font-semibold text-black m-[1%]">
                System Under Maintenance
            </div>
            <div class="text-[80px] font-bold text-black m-[1%]">
                503
            </div>
            <div class="text-[15px] w-1/2 min-w-[40%] text-center text-black m-[1%]">
                We're currently performing scheduled maintenance. Please check back later.
            </div>
        </div>
    </div>

    {{-- Characters Animation --}}
    <div id="characters" class="absolute w-[99%] h-[95%]"></div>

    {{-- Circle Animation --}}
    <canvas id="circleCanvas" class="w-full h-full"></canvas>

    {{-- Animation Scripts --}}
    <script>
        // Stick Figures Setup
        const stickFigures = [
            { top: '0%', src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg', transform: 'rotateZ(-90deg)', speedX: 1500 },
            { top: '10%', src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick1.svg', speedX: 3000, speedRotation: 2000 },
            { top: '20%', src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick2.svg', speedX: 5000, speedRotation: 1000 },
            { top: '25%', src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg', speedX: 2500, speedRotation: 1500 },
            { top: '35%', src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg', speedX: 2000, speedRotation: 300 },
            { bottom: '5%', src: 'https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick3.svg', speedX: 0 }
        ];

        const charactersContainer = document.getElementById('characters');

        stickFigures.forEach((figure, index) => {
            const stick = document.createElement('img');
            stick.classList.add('characters');
            stick.src = figure.src;
            if (figure.top) stick.style.top = figure.top;
            if (figure.bottom) stick.style.bottom = figure.bottom;
            if (figure.transform) stick.style.transform = figure.transform;
            charactersContainer.appendChild(stick);

            if (index === 5) return;

            stick.animate([{ left: '100%' }, { left: '-20%' }], {
                duration: figure.speedX,
                easing: 'linear',
                fill: 'forwards'
            });

            if (index > 0 && figure.speedRotation) {
                stick.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }], {
                    duration: figure.speedRotation,
                    iterations: Infinity,
                    easing: 'linear'
                });
            }
        });

        // Circle Animation
        const canvas = document.getElementById('circleCanvas');
        const ctx = canvas.getContext('2d');
        let circles = [];
        let timer = 0;
        let animationFrame;

        const initCircles = () => {
            circles = [];
            const width = canvas.width = window.innerWidth;
            const height = canvas.height = window.innerHeight;
            for (let i = 0; i < 300; i++) {
                circles.push({
                    x: Math.random() * (width * 3 - width * 1.2) + width * 1.2,
                    y: Math.random() * (height - height * -0.2) + height * -0.2,
                    size: width / 1000
                });
            }
        };

        const draw = () => {
            timer++;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const width = canvas.width;
            const height = canvas.height;
            const distanceX = width / 80;
            const growthRate = width / 1000;

            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'white';

            circles.forEach(c => {
                ctx.beginPath();
                if (timer < 65) {
                    c.x -= distanceX;
                    c.size += growthRate;
                }
                if (timer > 65 && timer < 500) {
                    c.x -= distanceX * 0.02;
                    c.size += growthRate * 0.2;
                }
                ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
                ctx.fill();
            });

            if (timer < 500) {
                animationFrame = requestAnimationFrame(draw);
            }
        };

        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationFrame);
            initCircles();
            draw();
        });

        initCircles();
        draw();
    </script>
</body>
</html>
