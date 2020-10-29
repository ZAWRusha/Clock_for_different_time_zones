'use strict'

const addClockButton = document.querySelector('.add-clock'),
	removeAllClocksButton = document.querySelector('.remove-all-clocks'), // Получение кнопки удаления всех часов
	wrapper = document.querySelector('.wrapper')

let clockNum = 2 // Стартовое кол-во часов на странице


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
			this.removeClock = id.querySelector('.remove-clock') // Получение кнопки удаления часов

			let that = this
			this.currentTown.addEventListener('click', function (event) {
				that.getTheSelectedCity(event)
			})

			//Удаление часов
			this.removeClock.addEventListener('click', () => {
				this.deleteClock()
			})

			this.removeClock.addEventListener('click', () => {
				this.deleteClock()
			})

			//Функция удаления часов
			this.deleteClock = () => {
				id.classList.remove('open-clock')
				id.classList.add('close-clock')
				setInterval(() => id.remove(), 1000)
			}

			this.drawingStroke()

			//Слежение за выбором города из списка
			setInterval(() => this.drawingClock(), 50)
		}

		// Отрисовка часовых штрихов циферблата
		this.drawingStroke = function () {
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

let startNewClock = function (i) {
	let clockNumber = `clock${i}`
	const addClock = document.createElement('div')

	addClock.classList.add('clock-box', 'open-clock')
	addClock.id = `clock${i}`
	addClock.innerHTML = `
				<div class="remove-clock">+</div>

				<div class="clock-face">
					<div class="arrow-hour"></div>
					<div class="arrow-min"></div>
					<div class="arrow-sec"></div>
				</div>

				<div class="digital-box">
					<div class="clock-digital"></div>
				</div>

				<form method="post" name="formTown">
					<select class="current-town" name="selectTown">
						<option value="0" selected>Местное время</option>
						<option value="2">Калининград</option>
						<option value="3">Москва</option>
						<option value="7">Красноярск</option>
						<option value="8">Иркутск</option>
						<option value="10">Владивосток</option>
						<option value="10">Комсомольск-на-Амуре</option>
					</select>
				</form>
			`
	wrapper.append(addClock)
	clockNumber = new Clock()
	clockNumber.start(`clock${i}`)

}


for (let i = 1; i < clockNum + 1; i++) {
	startNewClock(i)
}

addClockButton.addEventListener('click', () => {
	clockNum++
	startNewClock(clockNum)
})

removeAllClocksButton.addEventListener('click', () => {
	wrapper.classList.add('close-all-clock')
	setTimeout(removeAllClocks, 1000)
})

let removeAllClocks = function () {
	wrapper.innerHTML = ''
	wrapper.classList.remove('close-all-clock')
	clockNum = 0
}