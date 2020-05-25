'use strict';

(function(){
	
	var updateButton = document.getElementById('update'),
	birthdaysText = document.getElementById('birthdays-text');

	var getInitials = function(fullName){

		var initials = [];

		fullName = fullName.split(' ');
		
		fullName.forEach(function(name){
			initials.push(name.charAt(0));
		});

		return initials.join('');
	};

	var getDay = function(birthDate, year){
		
		var month = parseInt(birthDate.split('/')[1], 10) - 1,
		date = birthDate.split('/')[0];

		var dateObject = new Date(year, month, date);

		return dateObject.getDay();
	};
	
	var getAge = function(birthDate){
		var today = new Date(),
		year = today.getYear();

		return (parseInt(year, 10) - parseInt(birthDate.split('/')[2], 10)) 
	};

	var getCardDimensions = function(numOfCards, initCount){
		var initCount = initCount || 1,
		widthPercent = 100 / initCount,
		slots = (100 / widthPercent) * initCount;

		if(slots >= numOfCards) return widthPercent;
		else return getCardDimensions(numOfCards, ++initCount);
	};
	
	var sortBirthdaysByAge = function(birthdays){
		return birthdays.sort(function(a,b){
			return a.age - b.age;
		})
	}

	var showBirthdayCards = function(birthdays){

		Object.keys(birthdays).forEach(function(day){
			var cards = birthdays[day],
			dimensions = getCardDimensions(cards.length);
			dimensions += '%';

			var dayContainer = document.getElementById('day-' + day),
			cardContainer = dayContainer.querySelector('.birthday-cards');
			
			var card_markup = '';
			sortBirthdaysByAge(cards).forEach(function(card){
				card_markup += '<div class="card" style="width:'+dimensions+';height:'+dimensions+';background-color:'+getRandomColor()+'"><div class="card-text">'+card.initials+'</div></div>';
			});
			
			cardContainer.innerHTML = card_markup;
		});
	};
	
	var getBirthdaysByDay = function(birthdays, year){
		var birthdaysByDay = {};

		birthdays.forEach(function(birthdayDetails){

			var initials = getInitials(birthdayDetails.name),
			day = getDay(birthdayDetails.birthday, year),
			age = getAge(birthdayDetails.birthday, year);

			var details = {
				initials : initials,
				day : day,
				age : age
			}

			birthdaysByDay[day] = birthdaysByDay[day] || [];

			birthdaysByDay[day].push(details);

		});		

		return birthdaysByDay;
	};
	
	var getRandomColor = function() {
	  var letters = '0123456789ABCDEF';
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
	    color += letters[Math.floor(Math.random() * 16)];
	  }
	  return color;
	};
	
	var throwError = function(error){
		throw new Error(error);
	};

	updateButton.addEventListener('click', function(){
		
		try {
			var birthdays = JSON.parse(birthdaysText.value);	
		} catch(e) {
			throw throwError("Invalid JSON");
		}
		
		var year = document.getElementById('year').value;
		year = parseInt(Math.abs(year),10);

		if(!year || isNaN(year)) throwError("Enter a valid year");

		var birthdaysByDay = getBirthdaysByDay(birthdays, year);

		showBirthdayCards(birthdaysByDay);

	});

})();