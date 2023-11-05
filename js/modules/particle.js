import * as THREE from 'three';

export default class Particle {
    constructor(cloth, x, y, mass) {
        this.cloth = cloth;
        this.x = x;
        this.y = y;
        this.position = new THREE.Vector3();
        this.previous = new THREE.Vector3();
        this.original = new THREE.Vector3();
        this.a = new THREE.Vector3(0, 0, 0);
        this.mass = mass;
        this.invMass = 1 / mass;
        this.tmp = new THREE.Vector3();
        this.tmp2 = new THREE.Vector3();

        this.init();
    }

    init(){
        this.cloth(this.x, this.y, this.position);
        this.cloth(this.x, this.y, this.previous);
        this.cloth(this.x, this.y, this.original);
    }
}