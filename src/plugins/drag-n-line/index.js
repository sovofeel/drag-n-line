import Vue from 'vue'
import {pushToSimpleNodeArray,
       getSimpleNodeArray, 
       resetSimpleNodeArray, 
       pushToWithPointNodeArray, 
       getWithPointNodeArray, 
       setWithPointNodeArray}  from './cacheHelper'

let parent, parentHeight, parentWidth, parentWidthNoResidue, blocksCountCache = 0

Vue.directive('drag-n-line', {
  bind(el, options, vnode) {    
    let startX, startY, initialMouseX, initialMouseY
    
    vnode.context.$nextTick(() => {
      parent = parent ? parent : document.getElementById('AppField')
      parentHeight = parentHeight ? parentHeight : parent.clientHeight - parentHeight % options.value.height
      parentWidth = parentWidth ? parentWidth : parent.clientWidth
      parentWidthNoResidue = parentWidthNoResidue ? parentWidthNoResidue : parentWidth - parentWidth % options.value.width
      
      let offsetElTop, offsetElLeft
    
      offsetElTop = options.value.width * (options.value.index + 1) / parentWidthNoResidue
      offsetElLeft = (options.value.width * options.value.index / parentWidthNoResidue) * parentWidthNoResidue

      el.style.left = `${offsetElLeft % parentWidthNoResidue}px`;
      el.style.top = `${options.value.height * (Math.ceil(offsetElTop) - 1)}px`;
      
      el.style.position = 'absolute';
      el.style.width = `${options.value.width}px`
      el.style.height = `${options.value.height}px`

      calculateParams(
        parent, 
        parentWidthNoResidue, 
        options.value.height,
        blocksCountCache,
        options.value.blocksCount, 
      )
      blocksCountCache = options.value.blocksCount
    })

    el.addEventListener('contextmenu', function(e) {
      const target = e.target
      e.preventDefault()
      if(target.classList.contains('AppBlock__point')) {
        removeLine(target)
      }
    })

    el.addEventListener('mousedown', function(e) {
      if (e.target.hasAttribute('data-draggble')) {
        dropBlock(e)
      } else {
        initLine(e, options.value.index)
      }
    });
    function mouseup() {
      el.style.zIndex = 2
      el.style.opacity = 1
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    }
  
    function initLine (e, index) {
      const target  = e.target
      const datasetObj = Object.assign({}, target.dataset)

      let isSameNode
      getSimpleNodeArray().map(obj => {
        isSameNode = Object.values(obj.point)[0] === Object.values(datasetObj)[0]
      })

      const findedPoint = getWithPointNodeArray().find(obj => {
        return JSON.stringify(obj.start.point) === JSON.stringify(datasetObj) || 
               JSON.stringify(obj.end.point) === JSON.stringify(datasetObj)
      })
      
      if (isSameNode || !!findedPoint) return
      
      const centerX = target.getBoundingClientRect().left + target.offsetWidth / 2
      const centerY = target.getBoundingClientRect().top + target.offsetHeight / 2
      const toCache = {
        point:  datasetObj,
        id: index,
        x: centerX,
        y: centerY,
      }

      pushToSimpleNodeArray(toCache)
      const idList = getSimpleNodeArray()

      if (idList.length === 2) {

        const x1 = idList[0].x
        const y1 = idList[0].y
        const x2 = idList[1].x
        const y2 = idList[1].y

        const nodeWithPoint = {
          start: idList[0],
          end: idList[1]
        }

        pushToWithPointNodeArray(nodeWithPoint)
        const _id = getIdLine(nodeWithPoint)

        resetSimpleNodeArray()
        createLine(x1,y1,x2,y2, _id)
      }
    }

    function mousemove(e) {
      const dx = e.clientX - initialMouseX;
      const dy = e.clientY - initialMouseY;

      getWithPointNodeArray().map(obj => {
        const _id = getIdLine(obj)
        const direction = obj.start.id === options.value.index ? 'start' : 'end'
        const directionReverse = obj.start.id === options.value.index ? 'end' : 'start'
        const pointQuery = `[data-${Object.keys(obj[direction].point)}="${Object.values(obj[direction].point)}"]`
        const point = document.querySelector(pointQuery)
        const centerX = point.getBoundingClientRect().left + point.offsetWidth / 2
        const centerY = point.getBoundingClientRect().top + point.offsetHeight / 2

        moveLine(centerX, centerY, obj[directionReverse].x, obj[directionReverse].y, _id)
        obj[direction].x = centerX
        obj[direction].y = centerY
      })
      
      if (startY + dy + options.value.height >= parentHeight) {
        el.style.top = parentHeight
      } else if(startY + dy <= 0) {
        el.style.top = '0px';
      } else {
          el.style.top = startY + dy + 'px';
      }

      if (startX + dx + options.value.width >= parentWidth) {
        el.style.left = parentWidth
      } else if(startX + dx <= 0) {
        el.style.left = '0px';
      } else {
          el.style.left = startX + dx + 'px';
      }
    }

    function removeLine (target) {
      const datasetObj = Object.assign({}, target.dataset)

      const filteredPointArray = getWithPointNodeArray().filter(obj => {
        const findInStartPoint = JSON.stringify(obj.start.point) === JSON.stringify(datasetObj)
        const findInEndPoint = JSON.stringify(obj.end.point) === JSON.stringify(datasetObj)
        if (findInStartPoint || findInEndPoint) {
          const _id = getIdLine(obj)
          document.getElementById(_id).remove()
        }
          return !findInStartPoint && !findInEndPoint
      })

      setWithPointNodeArray(filteredPointArray)
    }

    function calculateParams(parent, parentWidth, childHeight, blocksCountCache, blocksCount) {
      if (blocksCountCache !== blocksCount) {
        const childsCount = parent.children.length
        const containerHeight = Math.ceil(childsCount / (parentWidth / childHeight)) * childHeight
        parent.style.height =  `${containerHeight}px`
        parent.style.paddingTop = `20px`
        parent.style.paddingBottom = `20px`
      }

      if (blocksCount < blocksCountCache && blocksCountCache !== 0) {
        const filteredPointArray = getWithPointNodeArray().filter(obj => {
          if (!(obj.start.id <  blocksCount && obj.end.id < blocksCount)) {
            const _id = getIdLine(obj)
            document.getElementById(_id) ? document.getElementById(_id).remove() : null
          }
          return obj.start.id <  blocksCount || obj.end.id < blocksCount
        })

        setWithPointNodeArray(filteredPointArray)
      }
    }

    function dropBlock(e) {
        el.style.zIndex = 3
        el.style.opacity = 0.9

        startX = el.offsetLeft
        startY = el.offsetTop

        initialMouseX = e.clientX
        initialMouseY = e.clientY

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }

    function createLine(x1,y1,x2,y2, lineId) {
      const {distance, xMid, yMid,  salopeInDegrees} = calculateLineGeometry(x1,y1,x2,y2)
      const line = document.createElement('div')

      line.setAttribute('id', `${lineId}`)
      line.setAttribute('class', `AppBlock__line`)
      parent.append(line)

      line.style.background = 'tomato'
      line.style.position = 'absolute'
      line.style.zIndex = 3
      line.style.height = '5px'
      line.style.width = `${distance}px`
      line.style.top = `${yMid}px`
      line.style.left = `${xMid - (distance / 2)}px`
      line.style.transform = `rotate(${salopeInDegrees}deg)`
    }

    function moveLine(x1,y1,x2,y2, lineId) {
      const {distance, xMid, yMid,  salopeInDegrees} = calculateLineGeometry(x1,y1,x2,y2)
      const line = document.getElementById(`${lineId}`)
      line.style.width = `${distance}px`
      line.style.top = `${yMid}px`
      line.style.left = `${xMid - (distance / 2)}px`
      line.style.transform = `rotate(${salopeInDegrees}deg)`
    }

    function getIdLine(obj) {
      return Object.keys(obj.start.point).toString() + '_' +
             Object.values(obj.start.point).toString() + '_' +
             Object.keys(obj.end.point).toString() + '_' +
             Object.values(obj.end.point).toString()
    }

    function calculateLineGeometry(x1,y1,x2,y2) {
      const distance = Math.sqrt(((x1-x2) * (x1-x2)) + ((y1-y2)*(y1-y2)))
      const xMid = (x1+x2) /2
      const yMid = (y1+y2) /2
      const salopeInRadian = Math.atan2(y1 - y2, x1 - x2)
      const salopeInDegrees = (salopeInRadian * 180 ) / Math.PI

      return {distance, xMid, yMid, salopeInDegrees}
    }
  }
})
