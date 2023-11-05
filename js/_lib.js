export function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
}

export function normalize(value, min, max) {
	return (value - min) / (max - min);
}

export function plane(width, height){
    return function (u, v, target){
        const x = (u - 0.5) * width;
        const y = (v + 0.5) * height;
        const z = 0;

        target.set(x, y, z);
    };
}

export function index(u, v, w) {
    return u + v * (w + 1);
}