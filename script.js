const searchForm = document.getElementById('searchForm');
const characterInfo = document.getElementById('characterInfo');
const characterImageContainer = document.getElementById('characterImageContainer');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const characterNameInput = document.getElementById('characterNameInput').value;
    const apiKey = '여기에 실제 API키 입력'

    /*  
    try {
        const [characterData, armoryData] = await Promise.all([
            fetchCharacterData(characterNameInput),
            fetchArmoryData(characterNameInput)
        ]);

        displayCharacterInfo(characterData, characterNameInput);
        if (armoryData.ArmoryProfile && armoryData.ArmoryProfile.CharacterImage) {
            displayCharacterImage(armoryData.ArmoryProfile.CharacterImage);
        }
        //  기타 데이터 표시 관련 코드들 추가로 작성해야 함

    } catch (error) {
        console.error('Error fetching data:', error); // 실제 에러 객체를 로깅
        characterInfo.innerHTML = `<p>Failed to fetch data. Please try again later.</p>`;
        // 사용자에게 더 구체적인 메시지를 표시하거나, UI 요소를 사용하여 표시 방식을 개선할 수 있음
    }
});

async function fetchCharacterData(characterNameInput) {
    const response = await fetch(`https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(characterNameInput)}/siblings`, {
        headers: {
            'Authorization': `bearer ${apiKey}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch character info. Please check your network connection and try again.');
    }
    return response.json();
}

async function fetchArmoryData(characterNameInput) {
    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(characterNameInput)}`, {
        headers: {
            'Authorization': `bearer ${apiKey}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch armory info. Please try again later.');
    }
    return response.json();
}
    */

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
                'Authorization': `bearer ${apikey}`
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
    /*      네트워크 오류 및 예외 처리 강화
        try {
    const response = await fetch(`https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(characterNameInput)}/siblings`, {
        headers: {
            'Authorization': `bearer ${apiKey}`
        }
    });

    if (!response.ok) {
        // HTTP 상태 코드에 따라 다른 처리 가능
        if (response.status === 401) {
            throw new Error('인증에 실패했습니다. API 키가 올바른지 확인하세요.');
        } else if (response.status === 404) {
            throw new Error('캐릭터 정보를 찾을 수 없습니다.');
        } else {
            throw new Error('서버에서 데이터를 가져오지 못했습니다.');
        }
    }

    const characterData = await response.json();
    // 데이터 표시

} catch (error) {
    console.error('Error fetching character info:', error.message);

    if (error instanceof TypeError && error.message.includes('failed to fetch')) {
        characterInfo.textContent = '네트워크 연결이 끊어졌습니다. 인터넷 연결을 확인하고 다시 시도하세요.';
    } else {
        characterInfo.textContent = '서버에서 데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.';
    }
    // 구체적인 오류 메시지 표시
}      
    */
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
            <td><img src="${equipment.Icon}" alt="${equipment.Name}" width="50"></td>
        `;
        equipmentTable.appendChild(row);
    });

    characterInfo.appendChild(equipmentTable);
}
/*  displaySkillsInfo 함수 내부에 잘못된 위치에 이벤트 리스너가 등록된 부분 수정하기
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
    });

    characterInfo.appendChild(skillsTable);

    // 이벤트 리스너를 함수 외부로 이동
    initializeTableStyles();
}

// 함수 외부에 이벤트 리스너 정의
function initializeTableStyles() {
    document.addEventListener('DOMContentLoaded', function() {
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');

            if (cells.length > 0) {
                cells[0].style.color = 'black';
                cells[cells.length - 1].style.color = 'black'
            } else {
                console.error('Could not find any <td> elements in the row.');
            }
        });
        // 전체 문서의 텍스트 색상을 검정색으로 변경
        document.body.style.color = 'black';
    });
}
*/
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

    document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');

        if(cells.length > 0) {
            cells[0].style.color = 'black';
            cells[cells.length - 1].style.color = 'black'
        } else {
            console.error('Could not find any <td> elements in the row.');
        }
    });
    // 전체 문서의 텍스트 색상을 검정색으로 변경
    document.body.style.color = 'black';
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
