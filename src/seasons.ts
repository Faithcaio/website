const snowFlakeShapes = [
    // Snowflake shapes - 6-pointed stars with decorative details
    {
        path: 'M 15 0 L 15 30 M 0 15 L 30 15 M 4 4 L 26 26 M 26 4 L 4 26 M 15 5 L 12 8 L 18 8 Z M 15 25 L 12 22 L 18 22 Z M 5 15 L 8 12 L 8 18 Z M 25 15 L 22 12 L 22 18 Z',
        width: 30,
        height: 30
    },
    {
        path: 'M 12 0 L 12 24 M 0 12 L 24 12 M 3 3 L 21 21 M 21 3 L 3 21 M 12 4 L 10 6 L 14 6 Z M 12 20 L 10 18 L 14 18 Z M 4 12 L 6 10 L 6 14 Z M 20 12 L 18 10 L 18 14 Z',
        width: 24,
        height: 24
    },
    {
        path: 'M 16 0 L 16 32 M 0 16 L 32 16 M 5 5 L 27 27 M 27 5 L 5 27 M 16 6 L 13 9 L 19 9 Z M 16 26 L 13 23 L 19 23 Z M 6 16 L 9 13 L 9 19 Z M 26 16 L 23 13 L 23 19 Z',
        width: 32,
        height: 32
    },
    {
        path: 'M 14 0 L 14 28 M 0 14 L 28 14 M 4 4 L 24 24 M 24 4 L 4 24 M 14 5 L 11 8 L 17 8 Z M 14 23 L 11 20 L 17 20 Z M 5 14 L 8 11 L 8 17 Z M 23 14 L 20 11 L 20 17 Z',
        width: 28,
        height: 28
    },
    {
        path: 'M 13 0 L 13 26 M 0 13 L 26 13 M 3.5 3.5 L 22.5 22.5 M 22.5 3.5 L 3.5 22.5 M 13 4.5 L 10.5 7 L 15.5 7 Z M 13 21.5 L 10.5 19 L 15.5 19 Z M 4.5 13 L 7 10.5 L 7 15.5 Z M 21.5 13 L 19 10.5 L 19 15.5 Z',
        width: 26,
        height: 26
    },
]
const leafShapes = [
    {
        path: 'm3.707 21.707 2.967-2.967a7.533 7.533 0 0 0 4.2 1.23 8.886 8.886 0 0 0 6.332-2.763C21.019 13.4 21.958 3.51 22 3.09a1 1 0 0 0-.289-.8 1.013 1.013 0 0 0-.8-.289 45.808 45.808 0 0 0-5.7.961 1 1 0 0 0-.714.64l-.649 1.834-.539-1.085a1 1 0 0 0-1.219-.5 13.782 13.782 0 0 0-5.295 2.94c-3.571 3.571-3.216 8.066-1.535 10.535l-2.967 2.967a1 1 0 0 0 1.414 1.414zm4.5-13.5a10.7 10.7 0 0 1 3.705-2.164l1.192 2.4a.98.98 0 0 0 .957.557 1 1 0 0 0 .881-.665L16.2 4.791a46.16 46.16 0 0 1 3.66-.647c-.367 2.694-1.48 9.066-4.063 11.649-2.788 2.788-5.945 2.457-7.668 1.5l4.582-4.582a1 1 0 0 0-1.414-1.414l-4.586 4.578C5.751 14.151 5.42 11 8.207 8.207z',
        width: 24,
        height: 24
    },
    {
        path: 'm3.707 21.707 2.967-2.967a7.533 7.533 0 0 0 4.2 1.23 8.888 8.888 0 0 0 6.332-2.763C21.02 13.4 21.958 3.509 22 3.09a1 1 0 0 0-.289-.8A1.028 1.028 0 0 0 20.91 2c-.419.038-10.3.976-14.117 4.789-3.569 3.573-3.214 8.068-1.533 10.537l-2.967 2.967a1 1 0 0 0 1.414 1.414zm4.5-13.5c2.584-2.583 8.956-3.7 11.65-4.063-.365 2.693-1.477 9.062-4.064 11.649C13 18.581 9.848 18.25 8.125 17.289l4.582-4.582a1 1 0 0 0-1.414-1.414l-4.581 4.581c-.961-1.723-1.292-4.88 1.495-7.667z',
        width: 24,
        height: 24
    },
    {
        path: 'M21 2c-5.363 0-9.4 1.517-11.992 4.507-3.241 3.736-3.171 8.56-3.05 10.121l-3.665 3.665a1 1 0 0 0 1.414 1.414l3.724-3.724c2.045-.1 9.949-.739 11.5-4.612A65.031 65.031 0 0 0 21.98 3.2 1 1 0 0 0 21 2zm-3.929 10.629c-.694 1.735-4.262 2.73-7.432 3.146l3.067-3.067 4-4a1 1 0 1 0-1.414-1.414L13 9.586V9a1 1 0 0 0-2 0v2.586l-3.04 3.04A11.489 11.489 0 0 1 10.53 7.8c2-2.3 5.1-3.563 9.215-3.773a63.686 63.686 0 0 1-2.674 8.602z',
        width: 24,
        height: 24
    }
];

export class Season {
    constructor(name: string, months: number[], particles: ParticleSetting[]) {
        this.name = name
        this.months = months
        this.particles = particles
    }

    name: string;
    months: number[];
    particles: ParticleSetting[];
}

export class ParticleSetting {
    constructor(density: number, shapes: { path: string; width: number; height: number; }[], colors: string[]) {
        this.density = density
        this.shapes = shapes
        this.colors = colors
    }

    density: number;
    shapes: { path: string; width: number; height: number; }[];
    colors: string[]
}

const SEASONS = {
    spring: new Season('spring', [2, 3, 4], [
        new ParticleSetting(30,
            leafShapes,
            [
                '#90EE90', // Light green
                '#98FB98', //Pale green
                '#8FBC8F', // Dark sea green
                '#3CB371', // Medium sea green
                '#2E8B57', // Sea green
                '#00FA9A'  // Medium spring green
            ],
        )

    ]),
    summer: new Season('summer', [5, 6, 7], [
        new ParticleSetting(30,
            leafShapes,
            [
                '#228B22', // Forest green
                '#32CD32', // Lime green
                '#00FF00', // Lime
                '#7CFC00', // Lawn green
                '#7FFF00', // Chartreuse
                '#ADFF2F'  // Green yellow
            ]
        )

    ]),
    autumn: new Season('autumn', [8, 9, 10], [
        new ParticleSetting(30,
            leafShapes,
            [
                '#FF4500', // Orange red
                '#FF6347', // Tomato
                '#FF8C00', // Dark orange
                '#FFA500', // Orange
                '#FFD700', // Gold
                '#DAA520', // Goldenrod
                '#B8860B', // Dark goldenrod
                '#8B4513'  // Saddle brown
            ],
        )

    ]),
    winter: new Season('winter', [11, 0, 1], [
        new ParticleSetting(40,
            snowFlakeShapes,
            [
                '#F0F8FF', // Alice blue
                '#E0FFFF', // Light cyan
                '#B0E0E6', // Powder blue
                '#ADD8E6', // Light blue
                '#87CEEB', // Sky blue
                '#87CEFA'  // Light sky blue
            ]
        )

    ]),
}

export {
    SEASONS
}