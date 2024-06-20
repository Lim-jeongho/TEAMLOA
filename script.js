const searchForm = document.getElementById('searchForm');
const characterInfo = document.getElementById('characterInfo');
const characterImageContainer = document.getElementById('characterImageContainer');


searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const characterNameInput = document.getElementById('characterNameInput').value;
    const apiKey = ''

    try {
        const response = await fetch(`https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(characterNameInput)}/siblings`, {
            headers: {
                'Authorization': 'bearer ' // 여기에 실제 사용할 API 키를 입력
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch character info. Please try again later.');
        }

        const characterData = await response.json();
        console.log(characterData);   
               
        displayCharacterInfo(characterData, characterNameInput); // 캐릭터 정보 화면에 표시
      
        const armoryResponse = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(characterNameInput)}`, {
            headers: {
                'Authorization': `bearer `
            }
        });

        if (!armoryResponse.ok) {
            throw new Error('Failed to fetch character image info. Please try again later.');
        }

        const armoryData = await armoryResponse.json();
       
        if (armoryData.ArmoryProfile && armoryData.ArmoryProfile.CharacterImage) {
            displayCharacterImage(armoryData.ArmoryProfile.CharacterImage);
        }   // 캐릭터 이미지 표시

        if (armoryData.Collectibles && armoryData.Collectibles.length > 0) {
            displayCollectibles(armoryData.Collectibles);
        }   // 수집품 정보 표시

        if (armoryData.ArmoryCard && armoryData.ArmoryCard.Cards.length > 0) {
            displayArmoryCardInfo(armoryData.ArmoryCard.Cards);
        }   // 카드 정보 표시

        if (armoryData.ArmoryEquipment && armoryData.ArmoryEquipment.length > 0) {
            displayEquipmentInfo(armoryData.ArmoryEquipment);
        }    // 장비 정보 표시

        if (armoryData.ArmorySkills && armoryData.ArmorySkills.length > 0) {
            displaySkillsInfo(armoryData.ArmorySkills);
        }   // 스킬 정보 표시
        
        if (armoryData.ArmoryGem && armoryData.ArmoryGem.Gems.length > 0) {
            displayArmoryGemInfo(armoryData.ArmoryGem.Gems);
        }   else {
            console.log('No ArmoryGem data found.');
        }   // 보석 정보 표시

        

    } catch (error) {
        console.error('Error fetching character info:', error.message);
        characterInfo.textContent = 'Failed to fetch character info. Please try again later.';
    }
});

function displayCharacterInfo(characterData, searchedCharacterName) {
    
    characterInfo.innerHTML = '';   // 검색한 캐릭터 정보를 표시하는 코드

    const searchedCharacter = characterData.find(character => character.CharacterName === searchedCharacterName);   // 검색한 캐릭터 정보만 필터링하여 표시
    if (searchedCharacter) {
        const characterElement = document.createElement('div');
        characterElement.innerHTML = `
            <h1>${searchedCharacter.CharacterName}</h1>
            <h1>전투 레벨 : ${searchedCharacter.CharacterLevel}</h1>
            <h1>클래스 : ${searchedCharacter.CharacterClassName}</h1>
            <h1>서버 : ${searchedCharacter.ServerName}</h1>
            <h1>아이템 레벨 : ${searchedCharacter.ItemAvgLevel}</h1>
        `;
        characterInfo.appendChild(characterElement);        
    } else {
        characterInfo.textContent = '검색한 캐릭터 정보를 찾을 수 없습니다.';
    }
}

function displayCharacterImage(imageUrl) {
    const characterImage = document.createElement('img');
    characterImage.src = imageUrl;

    characterImageContainer.innerHTML = '';
    characterImageContainer.appendChild(characterImage);
}

function displayEquipmentInfo(equipmentData) {
    const equipmentTable = document.createElement('table');
    const tableHeader = `
        <tr>
            <th>종류</th>
            <th>이름</th>
            <th>등급</th>
            <th>아이콘</th>
        </tr>
    `;
    equipmentTable.innerHTML = tableHeader;

    equipmentData.forEach(equipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.Type}</td>
            <td>${equipment.Name}</td>
            <td>${equipment.Grade}</td>
            <td><img src="${equipment.Icon}" alt="${equipment.Name}" width="45"></td>
        `;
        equipmentTable.appendChild(row);
    });

    characterInfo.appendChild(equipmentTable);
}

function displaySkillsInfo(skillsData) {
    const skillsTable = document.createElement('table');
    const tableHeader = `
        <tr>
            <th>이름</th>
            <th>아이콘</th>
            <th>레벨</th>
            <th>타입</th>
            <th>각인</th>
        </tr>
    `;
    skillsTable.innerHTML = tableHeader;

    skillsData.forEach(skill => {
        const row = document.createElement('tr');
        const tripods = skill.Tripods.map(tripod => `<li>${tripod.Name}: ${tripod.Tooltip}</li>`).join('');
        row.innerHTML = `
            <td>${skill.Name}</td>
            <td><img src="${skill.Icon}" alt="${skill.Name}" width="50"></td>
            <td>${skill.Level}</td>
            <td>${skill.Type}</td>
            <td>${tripods}</td>
        `;
        skillsTable.appendChild(row);

        // 스킬 각인 요소의 텍스트 색상을 검정색으로 변경(해결안됨)
        // const skillInfoCell = row.querySelector('td:first-child');
        // skillInfoCell.style.color = 'black';
        const skillInfoCell = row.querySelector('td:first-child');
        if (skillInfoCell) {
            skillInfoCell.style.color = 'black';
        } else {
            console.error('Could not find the first <td> element in the row.');
        }

        document.body.style.color = 'black';    // 전체 문서의 텍스트 색상을 검정색으로 변경

        
    });

    characterInfo.appendChild(skillsTable);
}

function displayArmoryCardInfo(cardsData) {
    const armoryCardHeader = document.createElement('h2');
    armoryCardHeader.textContent = "사용중인 카드";
    characterInfo.appendChild(armoryCardHeader);

    const armoryCardContainer = document.createElement('div');
    armoryCardContainer.classList.add('armory-card-container');

    let rowCount = 0;
    let currentRow;

    cardsData.forEach((card, index) => {
        if (index % 2 === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('armory-card-row');
            armoryCardContainer.appendChild(currentRow);
            rowCount++;
        }

        const cardElement = document.createElement('div');
        cardElement.classList.add('armory-card');

        const cardImage = document.createElement('img');
        cardImage.src = card.Icon;

        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card-info');

        const cardName = document.createElement('h3');
        cardName.textContent = card.Name;

        const cardGrade = document.createElement('p');
        cardGrade.textContent = `등급: ${card.Grade}`;

        cardInfo.appendChild(cardName);
        cardInfo.appendChild(cardGrade);

        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardInfo);

        currentRow.appendChild(cardElement);
    });

    characterInfo.appendChild(armoryCardContainer);
}

function displayArmoryGemInfo(armoryGemData) {
    const armoryGemHeader = document.createElement('h2');
    armoryGemHeader.textContent = "장착중인 보석";
    characterInfo.appendChild(armoryGemHeader);

    const armoryGemTable = document.createElement('table');
    armoryGemTable.classList.add('armory-gem-table'); // 클래스 추가

    for (let i = 0; i < armoryGemData.length; i += 2) {
        const row = armoryGemTable.insertRow();

        for (let j = i; j < i + 2 && j < armoryGemData.length; j++) {
            const gem = armoryGemData[j];

            const cell1 = row.insertCell();
            const gemImage = document.createElement('img');
            gemImage.src = gem.Icon;
            gemImage.alt = gem.Name;
            cell1.appendChild(gemImage);

            const cell2 = row.insertCell();
            cell2.textContent = gem.Level;
        }
    }

    characterInfo.appendChild(armoryGemTable);
}

function displayCollectibles(collectiblesData) {
    const collectiblesHeader = document.createElement('h2');
    collectiblesHeader.textContent = "수집품";
    characterInfo.appendChild(collectiblesHeader);

    const collectiblesTable = document.createElement('table');
    collectiblesTable.classList.add('collectibles-table'); 

    let row;
    for (let i = 0; i < collectiblesData.length; i++) {
        if (i % 3 === 0) {
            row = collectiblesTable.insertRow();
        }
        
        const collectible = collectiblesData[i];
        const cell = row.insertCell();

        const iconImage = document.createElement('img');
        iconImage.src = collectible.Icon;
        iconImage.alt = collectible.Type;
        cell.appendChild(iconImage);

        const typeText = document.createElement('p');
        typeText.textContent = collectible.Type;
        cell.appendChild(typeText);

        const pointText = document.createElement('p');
        pointText.textContent = `Point: ${collectible.Point} / ${collectible.MaxPoint}`;
        cell.appendChild(pointText);
    }

    characterInfo.appendChild(collectiblesTable);
}
