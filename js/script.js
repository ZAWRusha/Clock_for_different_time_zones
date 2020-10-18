'use strict'

// Получение констант
const clockFace = document.querySelector('.clock-face'),
	arrowHour = document.querySelector('.arrow-hour'),
	arrowMin = document.querySelector('.arrow-min'),
	arrowSec = document.querySelector('.arrow-sec'),
	clockDigital = document.querySelector('.clock-digital'),
	objSel = document.formTown.selectTown, // Получаем тег "select" из "form".
	degrees = 360, // полный круг = 360 градусов
	angleHour = degrees / 12, // градус перемещение часовой стрелки за один час
	angleSec = degrees / 60, // градус перемещения минутной и секундной стрелки, за минуту и секунду соответственно
	currentTimeZone = new Date().getTimezoneOffset() / -60 // Получение текущей (на локальном компьютере) временной зоны

let angleStroke = angleHour // шаг часовых штрихов
let correctingHour = +objSel.options[objSel.selectedIndex].value // получение временной зоны выбранного города из html

// Отрисовка часовых штрихов циферблата
function drawingStroke() {
	for (let i = 1; i <= 12; i++) {
		let stroke = document.createElement('div')
		stroke.style.transform = `rotateZ(${angleStroke}deg)`
		clockFace.append(stroke)
		stroke.classList.add('stroke')
		angleStroke = angleStroke + angleHour
	}
}

//Получение выбранного города (временной зоны) из списка
function getTheSelectedCity(event) {
	if (event.target.value == 0) {
		correctingHour = 0
	}
	else {
		correctingHour = +event.target.value - currentTimeZone
	}
}

//Получение времени и отрисовка часов
function drawingClock() {
	//Получение текущего времени
	let time = new Date()

	//Получение времени - часов, минут и секунд с учетом выбранного города (временной зоны)
	let hour = time.getHours() + correctingHour
	let min = time.getMinutes()
	let sec = time.getSeconds()

	// Поворот стрелок в стрелочных часах
	arrowHour.style.transform = `rotateZ(${hour * angleHour + min * angleHour / 60}deg)`
	arrowMin.style.transform = `rotateZ(${min * angleSec + sec * angleSec / 60}deg)`
	arrowSec.style.transform = `rotateZ(${sec * angleSec}deg)`

	//Получение времени - часов, минут и секунд для цифровых часов
	hour = doubleDigit(hour)
	min = doubleDigit(min)
	sec = doubleDigit(sec)

	//Отрисовка цифровых часов
	clockDigital.innerHTML = `${hour}:${min}:${sec}`
}

//Корректировка двузначного формата числа для цифровых часов
function doubleDigit(digit) {
	if (digit < 10) {
		return `0${digit}`
	} else {
		return digit
	}
}

objSel.addEventListener('click', getTheSelectedCity) //Слежение за выбором города из списка
drawingStroke()
setInterval(() => drawingClock(), 500)