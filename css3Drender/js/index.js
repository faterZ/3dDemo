
var camera, scene, renderer;
var geometry, material, mesh;
var target = new THREE.Vector3();

var lon = 90, lat = 0;
var phi = 0, theta = 0;

var touchX, touchY;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    scene = new THREE.Scene();

    var sides = [
        {
            url: 'images/posx.jpg',
            position: [ -512, 0, 0 ],
            rotation: [ 0, Math.PI / 2, 0 ]
        },
        {
            url: 'images/negx.jpg',
            position: [ 512, 0, 0 ],
            rotation: [ 0, -Math.PI / 2, 0 ]
        },
        {
            url: 'images/posy.jpg',
            position: [ 0,  512, 0 ],
            rotation: [ Math.PI / 2, 0, Math.PI ]
        },
        {
            url: 'images/negy.jpg',
            position: [ 0, -512, 0 ],
            rotation: [ - Math.PI / 2, 0, Math.PI ]
        },
        {
            url: 'images/posz.jpg',
            position: [ 0, 0,  512 ],
            rotation: [ 0, Math.PI, 0 ]
        },
        {
            url: 'images/negz.jpg',
            position: [ 0, 0, -512 ],
            rotation: [ 0, 0, 0 ]
        }
    ];

    for ( var i = 0; i < sides.length; i ++ ) {

        var side = sides[ i ];

        var element = document.getElementById("surface_"+i);
        element.width = 1026; // 2 pixels extra to close the gap.
        element.src = side.url;

        var object = new THREE.CSS3DObject( element );
        object.position.fromArray( side.position );
        object.rotation.fromArray( side.rotation );
        scene.add( object );

    }

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );

    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );

}

function onDocumentMouseMove( event ) {

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    lon -= movementX * 0.1;
    lat += movementY * 0.1;

}

function onDocumentMouseUp( event ) {

    document.removeEventListener( 'mousemove', onDocumentMouseMove );
    document.removeEventListener( 'mouseup', onDocumentMouseUp );

}

function onDocumentMouseWheel( event ) {

    camera.fov += event.deltaY * 0.05;
    camera.updateProjectionMatrix();

}

function onDocumentTouchStart( event ) {

    event.preventDefault();

    var touch = event.touches[ 0 ];

    touchX = touch.screenX;
    touchY = touch.screenY;

}

function onDocumentTouchMove( event ) {

    event.preventDefault();

    var touch = event.touches[ 0 ];

    lon -= ( touch.screenX - touchX ) * 0.1;
    lat += ( touch.screenY - touchY ) * 0.1;

    touchX = touch.screenX;
    touchY = touch.screenY;

}

function animate() {

    requestAnimationFrame( animate );

    // lat +=  0.1;
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    target.x = Math.sin( phi ) * Math.cos( theta );
    target.y = Math.cos( phi );
    target.z = Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( target );

    renderer.render( scene, camera );

}