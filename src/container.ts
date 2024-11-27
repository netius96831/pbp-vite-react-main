export const createContainer = (containerId: string) => {
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 600px;
    height: 680px;
    z-index: 9999999;
    border: 1px solid black;
  `
  container.id = containerId

  // create shadow root
  const shadow = container.attachShadow({mode: 'open'})

  const setBoundedPosition = (left: number, top: number) => {
    const boundedLeft = Math.max(0, Math.min(left, window.innerWidth - container.offsetWidth))
    const boundedTop = Math.max(0, Math.min(top, window.innerHeight - container.offsetHeight))
    container.style.left = `${boundedLeft}px`
    container.style.top = `${boundedTop}px`
  }

  window.addEventListener('resize', () => {
    setBoundedPosition(container.offsetLeft, container.offsetTop)
  })

  // container styles
  const containerStyle = document.createElement('style')
  containerStyle.textContent = `
    :host {
      background-color: white;
    }
  `
  shadow.appendChild(containerStyle)

  // drag button
  const drag = document.createElement('div')
  drag.style.cssText = `
    background-color: #ccc;
    width: 100%;
    height: 20px;
    cursor: move;
  `
  drag.addEventListener('mousedown', (e) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startLeft = container.offsetLeft
    const startTop = container.offsetTop
    const move = (e: MouseEvent) => {
      const left = startLeft + e.clientX - startX
      const top = startTop + e.clientY - startY
      setBoundedPosition(left, top)
    }
    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  })
  shadow.append(drag)

  // close button
  const close = document.createElement('div')
  close.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  close.innerHTML = 'X'
  close.addEventListener('click', () => {
    container.remove()
  })
  shadow.append(close)

  return container;
}

export default createContainer;