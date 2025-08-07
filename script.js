

class CleaningDutyDrawer {
    constructor() {
        this.drawButton = document.getElementById('drawButton');
        this.resetButton = document.getElementById('resetButton');
        this.resultContainer = document.getElementById('result');
        this.selectedNumbersDiv = document.getElementById('selectedNumbers');
        
        this.init();
    }
    
    init() {
        this.drawButton.addEventListener('click', () => this.drawNumbers());
        this.resetButton.addEventListener('click', () => this.reset());
        
        // SweetAlert2 환영 메시지
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        Swal.fire({
            title: '🧹 청소당번 추첨기에 오신 것을 환영합니다!',
            text: '공정하고 랜덤한 추첨으로 청소당번을 선정해보세요.',
            icon: 'info',
            confirmButtonText: '시작하기',
            confirmButtonColor: '#667eea',
            background: '#fff',
            backdrop: 'rgba(102, 126, 234, 0.1)',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }
    
    // 1부터 25까지 중에서 중복 없이 5개 숫자를 랜덤으로 선택
    async drawNumbers() {
        // 추첨 시작 알림
        const result = await Swal.fire({
            title: '추첨을 시작할까요?',
            text: '1번부터 25번까지 중에서 5명을 선택합니다.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '추첨 시작!',
            cancelButtonText: '취소',
            backdrop: 'rgba(102, 126, 234, 0.1)'
        });
        
        if (!result.isConfirmed) return;
        
        this.drawButton.disabled = true;
        this.drawButton.classList.add('drawing-animation');
        
        // 추첨 중 로딩 표시
        Swal.fire({
            title: '추첨 중입니다...',
            html: '<i class="fas fa-dice fa-spin fa-3x text-primary"></i>',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            background: '#fff',
            backdrop: 'rgba(102, 126, 234, 0.1)',
            timer: 2000
        });
        
        // 2초 후에 결과 표시
        setTimeout(() => {
            const selectedNumbers = this.getRandomNumbers(1, 25, 5);
            this.displayResult(selectedNumbers);
            this.showResultAlert(selectedNumbers);
            
            this.drawButton.disabled = false;
            this.drawButton.classList.remove('drawing-animation');
            this.drawButton.style.display = 'none';
            this.resetButton.style.display = 'inline-block';
        }, 2000);
    }
    
    // SweetAlert2로 결과 표시
    showResultAlert(numbers) {
        const numbersHtml = numbers.map(num => 
            `<span class="badge bg-gradient text-white p-2 m-1 fs-5" style="background: linear-gradient(45deg, #ff6b6b, #ee5a24);">${num}</span>`
        ).join('');
        
        Swal.fire({
            title: '🎉 추첨 완료!',
            html: `
                <div class="mb-3">
                    <p class="text-muted">선택된 청소당번은 다음과 같습니다:</p>
                </div>
                <div class="d-flex justify-content-center flex-wrap gap-2 mb-3">
                    ${numbersHtml}
                </div>
                <small class="text-muted">축하합니다! 선택된 분들은 청소 부탁드려요 😊</small>
            `,
            icon: 'success',
            confirmButtonText: '확인',
            confirmButtonColor: '#28a745',
            background: '#fff',
            backdrop: 'rgba(40, 167, 69, 0.1)',
            showClass: {
                popup: 'animate__animated animate__bounceIn'
            }
        });
    }
    
    // min부터 max까지 중에서 count개의 중복 없는 랜덤 숫자 생성
    getRandomNumbers(min, max, count) {
        const numbers = [];
        const available = [];
        
        // 가능한 모든 숫자를 배열에 추가
        for (let i = min; i <= max; i++) {
            available.push(i);
        }
        
        // Fisher-Yates 셔플 알고리즘을 사용하여 랜덤하게 선택
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            numbers.push(available.splice(randomIndex, 1)[0]);
        }
        
        // 오름차순으로 정렬
        return numbers.sort((a, b) => a - b);
    }
    
    // 결과를 화면에 표시
    displayResult(numbers) {
        this.selectedNumbersDiv.innerHTML = '';
        
        numbers.forEach((number, index) => {
            const numberCard = document.createElement('div');
            numberCard.className = 'number-card';
            numberCard.innerHTML = `
                <span>${number}</span>
                <i class="fas fa-star position-absolute" style="top: -5px; right: -5px; font-size: 0.8rem; color: #ffd700;"></i>
            `;
            this.selectedNumbersDiv.appendChild(numberCard);
        });
        
        this.resultContainer.classList.add('show');
    }
    
    // 초기 상태로 리셋
    async reset() {
        const result = await Swal.fire({
            title: '다시 추첨하시겠습니까?',
            text: '현재 결과가 초기화됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '네, 다시 추첨',
            cancelButtonText: '취소'
        });
        
        if (result.isConfirmed) {
            this.resultContainer.classList.remove('show');
            
            setTimeout(() => {
                this.selectedNumbersDiv.innerHTML = '';
                this.drawButton.style.display = 'inline-block';
                this.resetButton.style.display = 'none';
            }, 300);
            
            Swal.fire({
                title: '초기화 완료!',
                text: '새로운 추첨을 시작할 수 있습니다.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    }
}

// 페이지 로드 후 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CleaningDutyDrawer();
});

