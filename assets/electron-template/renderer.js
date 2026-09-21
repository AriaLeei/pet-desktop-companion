const pet = document.querySelector('#pet');
const pose = document.querySelector('#pose');
const cycle = [1, 2, 3, 4, 3, 2];
let cycleIndex = 0;
let dragging = false;
let state = 'walk';
let tilt = 'center';

function render() {
  if (state === 'walk') {
    pose.src = `assets/walk/walk-${String(cycle[cycleIndex]).padStart(2, '0')}.png`;
  } else if (state === 'curious') {
    pose.src = `assets/sit/${tilt}.png`;
  } else {
    pose.src = 'assets/sit/center.png';
  }
}

window.petAPI.onState((next) => {
  state = next.state;
  tilt = next.tilt || 'center';
  render();
});

pet.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  dragging = true;
  pet.classList.add('dragging');
  pet.setPointerCapture(event.pointerId);
  window.petAPI.dragStart(event.screenX, event.screenY);
});

pet.addEventListener('pointermove', (event) => {
  if (dragging) window.petAPI.dragMove(event.screenX, event.screenY);
});

function finishDrag(event) {
  if (!dragging) return;
  dragging = false;
  pet.classList.remove('dragging');
  if (pet.hasPointerCapture(event.pointerId)) pet.releasePointerCapture(event.pointerId);
  window.petAPI.dragEnd();
}

pet.addEventListener('pointerup', finishDrag);
pet.addEventListener('pointercancel', finishDrag);
setInterval(() => {
  if (state !== 'walk') return;
  cycleIndex = (cycleIndex + 1) % cycle.length;
  render();
}, 115);
render();
