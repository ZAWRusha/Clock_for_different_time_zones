'use strict'

let clock = {
	// Получение констант
	clockFace: document.querySelector('.clock-face'),
	arrowHour: document.querySelector('.arrow-hour'),
	arrowMin: document.querySelector('.arrow-min'),
	arrowSec: document.querySelector('.arrow-sec'),
	clockDigital: document.querySelector('.clock-digital'),
	objSel: document.formTown.selectTown, // Получаем тег "select" из "form".
	degrees: 360, // полный круг: 360 градусов
	angleHour: 30, //this.degrees / 12, // градус перемещение часовой стрелки за один час
	angleSec: 6, //this.degrees / 60, // градус перемещения минутной и секундной стрелки, за минуту и секунду соответственно
	currentTimeZone: new Date().getTimezoneOffset() / -60, // Получение текущей (на локальном компьютере) временной зоны
	angleStroke: 30, //this.angleHour, // шаг часовых штрихов
	correctingHour: 0, //+this.objSel.options[this.objSel.selectedIndex].value, // получение временной зоны выбранного города из html

	// Отрисовка часовых штрихов циферблата
	drawingStroke: function () {
		// console.log('currentTimeZone ' + this.currentTimeZone)
		for (let i = 1; i <= 12; i++) {
			let stroke = document.createElement('div')
			stroke.style.transform = `rotateZ(${this.angleStroke}deg)`
			this.clockFace.append(stroke)
			stroke.classList.add('stroke')
			this.angleStroke = this.angleStroke + this.angleHour
		}
	},

	//Получение выбранного города (временной зоны) из списка
	getTheSelectedCity: function (event) {
		if (event.target.value == 0) {
			this.correctingHour = 0
		}
		else {
			this.correctingHour = +event.target.value - this.currentTimeZone
		}
		// console.log('correctingHour ' + this.correctingHour);
	},

	//Получение времени и отрисовка часов
	drawingClock: function () {
		//Получение текущего времени
		let time = new Date()

		//Получение времени - часов, минут и секунд с учетом выбранного города (временной зоны)
		let hour = time.getHours() + this.correctingHour
		let min = time.getMinutes()
		let sec = time.getSeconds()

		// Поворот стрелок в стрелочных часах
		this.arrowHour.style.transform = `rotateZ(${hour * this.angleHour + min * this.angleHour / 60}deg)`
		this.arrowMin.style.transform = `rotateZ(${min * this.angleSec + sec * this.angleSec / 60}deg)`
		this.arrowSec.style.transform = `rotateZ(${sec * this.angleSec}deg)`

		//Получение времени - часов, минут и секунд для цифровых часов
		if (hour < 0) {
			hour = 24 + hour
		}

		if (hour > 23) {
			hour = hour - 24
		}

		hour = this.doubleDigit(hour)
		min = this.doubleDigit(min)
		sec = this.doubleDigit(sec)

		//Отрисовка цифровых часов
		this.clockDigital.innerHTML = `${hour}:${min}:${sec}`
	},

	//Корректировка двузначного формата числа для цифровых часов
	doubleDigit: function (digit) {
		if (digit < 10) {
			return `0${digit}`
		} else {
			return digit
		}
	},

	start: function () {
		let that = this
		document.formTown.selectTown.addEventListener('click', function (event) {
			that.getTheSelectedCity(event)
		})
		//Слежение за выбором города из списка
		this.drawingStroke()
		setInterval(() => this.drawingClock(), 500)
	}

}