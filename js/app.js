import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertex from "./shader/vertex.glsl";
import fragment from "./shader/fragment.glsl";

import grass from "../texture/grasslight.jpg";
import pattern from "../texture/circuit_pattern.png";

import dat from "dat.gui";
import { plane } from './_lib';
import Cloth from './modules/cloth';

export default class Sketch {
    constructor(opstions) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 500, 10000);

        this.container = opstions.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 1);

        this.container.appendChild(this.renderer.domElement);


        this.camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1.0,
            10000.0
        );
        this.camera.position.set(1000.0, 50.0, 1500.0);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.loader = new THREE.TextureLoader();
        this.clothFunction = plane(25 * 10, 25 * 10);
        this.cloth = new Cloth(10, 10, this.clothFunction);

        this.isPlaying = true;

        this.addCloth();
        this.addGround();
        this.addLight();
        this.resize();
        this.render();
        this.setupResize();
        this.settings();
    }

    settings() {
        let that = this;
        this.settings = {
            progress: 0,
        };

        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0.0, 1.0, 0.01);
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
    }

    addCloth() {
        let that = this;
        const clothMaterial = new THREE.MeshLambertMaterial({
            map: this.loader.load(pattern),
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        const clothGeometry = new ParametricGeometry(
            this.clothFunction,
            this.cloth.w,
            this.cloth.h
        );

        this.clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
        this.clothMesh.castShadow = true;
        this.scene.add(this.clothMesh);

        this.clothMesh.customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            map: this.loader.load(pattern),
            alphaTest: 0.5
        });
    }

    addGround() {
        const texture = this.loader.load(grass);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(25, 25);
        texture.anisotropy = 16;

        const groundMaterial = new THREE.MeshLambertMaterial({ map: texture });

        this.ground = new THREE.Mesh(
            new THREE.PlaneGeometry(20000.0, 20000.0),
            groundMaterial
        );
        this.ground.position.y = -250;
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    addLight() {
        const light1 = new THREE.AmbientLight(0x666666);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xdfebff, 1);
        light2.position.set(50.0, 200.0, 100.0);
        light2.position.multiplyScalar(1.3);
        light2.castShadow = true;

        light2.shadow.mapSize.width = 1024;
        light2.shadow.mapSize.height = 1024;
        const d = 300;

        light2.shadow.camera.left = -d;
        light2.shadow.camera.right = d;
        light2.shadow.camera.top = d;
        light2.shadow.camera.bottom = -d;

        light2.shadow.camera.far = 1000;
        this.scene.add(light2);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.render();
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.01;

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});