'use strict'

class Clock {
	constructor() {

		this.start = function (box) {

			// Получение ID clock (обертки часов)
			let idSelector = `#${box}`
			let id = document.querySelector(idSelector)

			// Получение констант
			this.clockFace = id.querySelector('.clock-face')
			this.arrowHour = id.querySelector('.arrow-hour')
			this.arrowMin = id.querySelector('.arrow-min')
			this.arrowSec = id.querySelector('.arrow-sec')
			this.clockDigital = id.querySelector('.clock-digital')
			this.currentTown = id.querySelector('.current-town') // Получаем выбранный город из списка.
			this.degrees = 360 // полный круг = 360 градусов
			this.angleHour = this.degrees / 12 // градус перемещение часовой стрелки за один час
			this.angleSec = this.degrees / 60 // градус перемещения минутной и секундной стрелки, за минуту и секунду соответственно
			this.currentTimeZone = new Date().getTimezoneOffset() / -60 // Получение текущей (на локальном компьютере) временной зоны
			this.angleStroke = this.angleHour // шаг часовых штрихов
			this.correctingHour = +this.currentTown.options[this.currentTown.selectedIndex].value // получение временной зоны выбранного города из html

			let that = this
			this.currentTown.addEventListener('click', function (event) {
				that.getTheSelectedCity(event)
			})
			//Слежение за выбором города из списка
			this.drawingStroke()
			setInterval(() => this.drawingClock(), 500)
		}

		// Отрисовка часовых штрихов циферблата
		this.drawingStroke = function () {
			// console.log('currentTimeZone ' + this.currentTimeZone)
			for (let i = 1; i <= 12; i++) {
				let stroke = document.createElement('div')
				stroke.style.transform = `rotateZ(${this.angleStroke}deg)`
				this.clockFace.append(stroke)
				stroke.classList.add('stroke')
				this.angleStroke = this.angleStroke + this.angleHour
			}
		}

		//Получение выбранного города (временной зоны) из списка
		this.getTheSelectedCity = function (event) {
			if (event.target.value == 0) {
				this.correctingHour = 0
			}
			else {
				this.correctingHour = +event.target.value - this.currentTimeZone
			}
		}

		//Получение времени и отрисовка часов
		this.drawingClock = function () {
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
		}

		//Корректировка двузначного формата числа для цифровых часов
		this.doubleDigit = function (digit) {
			if (digit < 10) {
				return `0${digit}`
			} else {
				return digit
			}
		}

	}
}