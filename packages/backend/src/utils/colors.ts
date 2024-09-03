type Color = 'reset' | 'cyan' | 'white' | 'gray' | 'green' | 'red' | 'yellow' | 'blue' | 'magenta';

const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    white: '\x1b[1m\x1b[37m',
    gray: '\x1b[90m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
} satisfies { [key in Color]: string };

function colorize(text: string, color: Color): string {
    return `${colors[color] || colors.reset}${text}${colors.reset}`;
}

// More specific functions based on the given color
function cyan(text: string): string {
    return colorize(text, 'cyan');
}

function whiteBold(text: string): string {
    return colorize(text, 'white');
}

function gray(text: string): string {
    return colorize(text, 'gray');
}

function green(text: string): string {
    return colorize(text, 'green');
}

function red(text: string): string {
    return colorize(text, 'red');
}

function yellow(text: string): string {
    return colorize(text, 'yellow');
}

function blue(text: string): string {
    return colorize(text, 'blue');
}

function magenta(text: string): string {
    return colorize(text, 'magenta');
}

export {
    cyan,
    whiteBold,
    gray,
    green,
    red,
    yellow,
    blue,
    magenta,
}