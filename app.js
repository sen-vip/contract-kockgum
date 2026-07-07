const APP_KEY = "contractKockgum.v0.1";

const TYPE_LABELS = {
  construction: "공사",
  service: "용역",
  goods: "물품",
};

const STATUS_LIST = ["미확인", "확인완료", "첨부확인", "생략가능", "해당없음", "보류"];
const DONE_STATUSES = new Set(["확인완료", "첨부확인", "생략가능", "해당없음"]);
const INTEGRATED_PLEDGE_NAMES = new Set([
  "청렴서약서",
  "수의계약 체결제한 여부 확인서",
  "수의계약 각서",
  "조세포탈 서약서",
]);
const INTEGRATED_PLEDGE_NOTE = "수의계약 통합서약서로 대체 가능";

const checklistData = {
  construction: [
    { stage: "품의 및 계약방법 결정", name: "품의서", basis: "학교회계 규칙 제32조", note: "품의금액 50만원 이하 전결 가능" },
    { stage: "품의 및 계약방법 결정", name: "설계서", basis: "원가계산 제비율", note: "시방서ㆍ도면 등 포함, 기초금액 작성" },
    { stage: "공고", name: "공고서", basis: "", note: "" },
    { stage: "공고", name: "계약 일반조건", basis: "집행기준 제13장", note: "" },
    { stage: "공고", name: "계약 특수조건", basis: "", note: "필요한 경우에 한하여 작성" },
    { stage: "계약상대자(낙찰자) 결정", name: "견적서", basis: "지방계약법 시행령 제30조", note: "" },
    { stage: "계약상대자(낙찰자) 결정", name: "적격심사 서류", basis: "낙찰자 결정기준 제2장", note: "입찰 시에만 징구" },
    { stage: "계약 체결", name: "계약서", basis: "지방계약법 시행령 제50조", note: "계약금액 5천만원 이하 작성 생략(승낙사항 등으로 대체) 가능" },
    { stage: "계약 체결", name: "승낙사항", basis: "학교회계 규칙 제32조의2", note: "계약금액 1백만원 이하 승낙사항은 공급자 날인 생략 가능" },
    { stage: "계약 체결", name: "산출내역서", basis: "", note: "견적서 등으로 내역을 확인할 수 있는 경우 생략 가능" },
    { stage: "계약 체결", name: "계약보증금(보증서, 지급확약서)", basis: "지방계약법 시행령 제53조", note: "계약금액 5천만원 이하 면제 가능(단, 지급 확약서는 징구). 지급확약서는 계약서 작성 시에만 징구(계약서 미작성시 승낙사항으로 대체)" },
    { stage: "계약 체결", name: "인지세", basis: "인지세법 제3조", note: "계약금액 1천만원 이하 해당없음" },
    { stage: "계약 체결", name: "국민주택채권", basis: "주택도시기금법 시행령 제8조", note: "계약금액 5억원 미만 해당없음" },
    { stage: "계약 체결", name: "공사 면허 등록증, 등록수첩", basis: "", note: "공사별 해당 면허 확인 시 징구" },
    { stage: "계약 체결", name: "사업자등록증 사본", basis: "", note: "G2B 등록정보로 대체 가능. 사업자등록번호 등으로 사업자등록사항이 확인되는 경우 생략 가능" },
    { stage: "계약 체결", name: "등기사항전부증명서(법인등기부등본)", basis: "", note: "필요한 경우만 징구" },
    { stage: "계약 체결", name: "사용인감계", basis: "", note: "G2B 경쟁입찰참가자격등록증 등으로 대체 가능" },
    { stage: "계약 체결", name: "청렴서약서", basis: "지방계약법 제6조의2", note: "" },
    { stage: "계약 체결", name: "수의계약 체결제한 여부 확인서", basis: "공직자의 이해충돌방지법 제12조", note: "" },
    { stage: "계약 체결", name: "수의계약 각서", basis: "집행기준 제5장", note: "입찰은 해당없음" },
    { stage: "계약 체결", name: "조세포탈 서약서", basis: "지방계약법 제31조의5 및 시행령 제93조", note: "" },
    { stage: "계약 체결", name: "계좌 사본(예금주 확인)", basis: "", note: "다른 서류 등으로 실명계좌 확인만 가능하면 생략 가능" },
    { stage: "착공", name: "착공신고서(착공계)", basis: "", note: "계약금액 1천만원 미만 작성 생략 가능" },
    { stage: "착공", name: "현장기술자 지정신고서", basis: "", note: "계약금액 1천만원 미만 작성 생략 가능. 단, 발주기관에서 필요한 경우 소규모 공사도 관련 서류 징구" },
    { stage: "착공", name: "공사공정예정표", basis: "", note: "계약금액 1천만원 미만 작성 생략 가능" },
    { stage: "착공", name: "착공 전 현장사진", basis: "", note: "준공사진의 공사전 사진으로 대체 가능" },
    { stage: "착공", name: "직접시공계획서", basis: "건설산업기본법 시행령 제30조의2", note: "계약금액이 4천만원 미만이고, 공사기간이 30일 이내인 경우 제출 생략 가능" },
    { stage: "착공", name: "전기, 수도료 납부 합의서(또는 미사용 각서)", basis: "교육재정과-24993(2015.12.15.)", note: "계약금액 1천만원 이하 전기, 수도료 미징수" },
    { stage: "착공", name: "노무비 구분관리 및 지급확인제 합의서", basis: "집행기준 제13장", note: "노무비 선지급 또는 공사기간 1개월 미만의 경우 '노무비 구분관리제 적용 제외 확인서' 징구로 대체. 상용근로자 만으로 공사 하는 경우 '노무비 구분관리제 및 지급확인제 적용 제외 확인서' 징구로 대체" },
    { stage: "착공", name: "공사(용역)안전·보건 체크리스트", basis: "학교보건진흥원 산업안전·보건과-1025(2021. 12. 31.)", note: "" },
    { stage: "준공", name: "준공계", basis: "", note: "계약금액 1천만원 미만 작성 생략 가능" },
    { stage: "준공", name: "준공검사원(의뢰서)", basis: "", note: "계약금액 1천만원 미만 작성 생략 가능" },
    { stage: "준공", name: "준공내역서ㆍ준공정산동의서", basis: "", note: "준공정산동의서(내역 변경 시)" },
    { stage: "준공", name: "산업안전보건관리비 집행내역", basis: "건설업 산업안전보건관리비 계상 및 사용기준(고용노동부 고시)", note: "총공사금액 2천만원 미만 미적용. 세금계산서, 거래명세서, 사진, 지급증빙 등" },
    { stage: "준공", name: "환경보전비 집행내역", basis: "건설기술진흥법 시행규칙 제61조", note: "세금계산서, 거래명세서, 사진, 지급증빙 등" },
    { stage: "준공", name: "보험 납입 증명확인서", basis: "집행기준 제1장", note: "국민연금ㆍ건강ㆍ노인장기요양보험료, 산재ㆍ고용보험료 계상 시 징구" },
    { stage: "준공", name: "건설근로자 퇴직공제부금 납부확인서", basis: "건설산업기본법 시행령 제83조", note: "공사예정금액 1억원 미만 미적용" },
    { stage: "준공", name: "폐기물 처리 관련 서류[계약금액에 반영 시 - 정산항목]", basis: "건설폐기물법 시행령 제11조", note: "폐기물처리비 계상 시 징구. 인계서, 확인서, 필증, 계량증명서 등. 5톤미만: (간이)계량증명서, 세금계산서 등. 5톤이상: 올바로시스템 처리 실적보고서, 계량증명서, 세금계산서 등" },
    { stage: "준공", name: "각종 필증", basis: "", note: "해당 공사시 징구" },
    { stage: "준공", name: "준공 사진", basis: "", note: "청소까지 완료된 마감사진" },
    { stage: "준공", name: "준공검사조서", basis: "지방계약법 시행령 제65조", note: "계약금액 3천만원 미만 작성 생략 가능" },
    { stage: "대가 지급", name: "대가청구서 및 세금계산서", basis: "지방계약법 시행령 제67조", note: "" },
    { stage: "대가 지급", name: "국세 납세증명서", basis: "국세징수법 시행령 제91조", note: "수의계약 시 제출 생략" },
    { stage: "대가 지급", name: "지방세 납세증명서", basis: "지방세징수법 시행령 제5조", note: "수의계약 시 제출 생략" },
    { stage: "대가 지급", name: "4대 사회보험료 완납증명서", basis: "국민연금법 제95조의2, 국민건강보험법 제81조의4, 고용산재보험료징수법 제29조의4", note: "지방회계법 시행령 38조에 따른 일상경비로 대가를 지급받는 계약 등 관계 법령에서 규정한 경우 생략 가능" },
    { stage: "대가 지급", name: "하자보수보증금(보증서)", basis: "지방계약법 시행규칙 제70조", note: "조경공사를 제외한 계약금액 3천만원 이하 공사 면제 가능(단, 지급 확약서 징구)" },
    { stage: "대가 지급", name: "노무비 지급내역서", basis: "집행기준 제13장, 건설산업기본법 제34조", note: "상용근로자 만으로 공사 하는 경우 '노무비 구분관리제 및 지급확인제 적용 제외 확인서' 징구로 대체. 도급금액 3천만원 이상이고 공사기간 30일 초과의 경우 전자대금시스템(하도급지킴이) 이용 의무화" },
  ],
  service: [
    { stage: "품의 및 계약방법 결정", name: "품의서", basis: "학교회계 규칙 제32조", note: "품의금액 50만원 이하 전결 가능" },
    { stage: "품의 및 계약방법 결정", name: "기초금액 산출내역서(과업내용서 포함)", basis: "", note: "추정가격 1천만원 이하 생략 가능" },
    { stage: "공고", name: "공고서", basis: "", note: "" },
    { stage: "공고", name: "계약 일반조건", basis: "집행기준 제14장", note: "" },
    { stage: "공고", name: "계약 특수조건", basis: "", note: "필요한 경우에 한하여 작성" },
    { stage: "계약상대자(낙찰자) 결정", name: "견적서", basis: "지방계약법 시행규칙 제33조", note: "추정가격 2백만원 미만 수의계약 생략 가능(2019. 6. 25. 개정)" },
    { stage: "계약상대자(낙찰자) 결정", name: "적격심사 서류", basis: "낙찰자 결정기준 제2장", note: "입찰 시에만 징구" },
    { stage: "계약상대자(낙찰자) 결정", name: "소기업, 소상공인 확인서 / 중기업 확인서", basis: "판로지원법 시행령 제2조의2, 지방계약법 시행령 제25조 제1항 제5호 다목", note: "관련 법에 따라 입찰 자격(입찰 제한내용) 확인. 2인이상 견적서 제출 수의계약시 징구(추정가격 2천만원 이하시 생략 가능). 공공구매종합정보(SMPP) 확인시 징구 생략 가능" },
    { stage: "계약상대자(낙찰자) 결정", name: "직접생산증명서", basis: "판로지원법 제9조", note: "중소기업자간 경쟁제품 추정가격 1천만원 미만 수의계약 시 생략(입찰 시에는 계약금액과 상관없이 확인 필요). 공공구매종합정보(SMPP) 확인시 징구 생략 가능" },
    { stage: "계약 체결", name: "계약서", basis: "지방계약법 시행령 제50조", note: "계약금액 5천만원 이하 작성 생략(승낙사항 등으로 대체) 가능" },
    { stage: "계약 체결", name: "승낙사항", basis: "학교회계 규칙 제32조의2", note: "계약금액 1백만원 이하 승낙사항은 공급자 날인 생략 가능" },
    { stage: "계약 체결", name: "산출내역서", basis: "", note: "견적서 등으로 내역을 확인할 수 있는 경우 생략 가능" },
    { stage: "계약 체결", name: "계약보증금(보증서, 지급 확약서)", basis: "지방계약법 시행령 제53조", note: "계약금액 5천만원 이하 면제 가능(단, 지급 확약서는 징구). 지급 확약서는 계약서 작성 시에만 징구(계약서 미작성 시 승낙사항으로 대체)" },
    { stage: "계약 체결", name: "인지세", basis: "인지세법 제3조", note: "계약금액 1천만원 이하 해당없음" },
    { stage: "계약 체결", name: "사업자등록증 사본", basis: "", note: "G2B 등록정보로 대체 가능. 사업자등록번호 등으로 사업자등록사항이 확인되는 경우 생략" },
    { stage: "계약 체결", name: "등기사항전부증명서(법인등기부등본)", basis: "", note: "필요한 경우만 징구" },
    { stage: "계약 체결", name: "자격(인가,허가,면허)등, 등록(신고)필증", basis: "", note: "해당 계약 시 징구" },
    { stage: "계약 체결", name: "사용인감계", basis: "", note: "G2B 경쟁입찰참가자격등록증 등으로 대체 가능" },
    { stage: "계약 체결", name: "청렴서약서", basis: "지방계약법 제6조의2", note: "" },
    { stage: "계약 체결", name: "수의계약 체결제한 여부 확인서", basis: "공직자의 이해충돌방지법 제12조", note: "" },
    { stage: "계약 체결", name: "수의계약 각서", basis: "집행기준 제5장", note: "" },
    { stage: "계약 체결", name: "조세포탈 서약서", basis: "지방계약법 제31조의5 및 시행령 제93조", note: "" },
    { stage: "계약 체결", name: "근로조건이행 확약서", basis: "", note: "해당 계약 시 징구(청소, 유인경비 등)" },
    { stage: "계약 체결", name: "보안각서", basis: "", note: "해당 계약 시 징구(학내망, 청소, 유인경비, 방과후 등)" },
    { stage: "계약 체결", name: "손해배상보험(공제)증서", basis: "설계·건설사업관리 용역 손해배상보험 또는 공제 업무요령(국토교통부고시)", note: "건축 감리 용역 계약의 경우 징구" },
    { stage: "계약 체결", name: "계좌 사본(예금주 확인)", basis: "", note: "다른 서류 등으로 실명계좌 확인만 가능하면 생략 가능" },
    { stage: "착수", name: "착수신고서", basis: "", note: "계약금액 5백만원 미만 생략 가능" },
    { stage: "착수", name: "용역 종사자 노무비 지급 확약서", basis: "", note: "해당 계약 시 징구(청소, 유인경비 등)" },
    { stage: "착수", name: "감시단속적 근로자에 대한 적용 제외 승인서", basis: "", note: "해당 계약 시 징구(유인경비)" },
    { stage: "착수", name: "책임기술자 선임계 및 참여기술자 명단", basis: "", note: "해당 계약 시 징구(설계 등)" },
    { stage: "착수", name: "공사(용역)안전·보건 체크리스트", basis: "학교보건진흥원 산업안전·보건과-1025(2021. 12. 31.)", note: "" },
    { stage: "완료", name: "완료신고서", basis: "", note: "" },
    { stage: "완료", name: "근로자 급여지급내역서", basis: "", note: "해당 계약 시 징구(청소, 유인경비 등 상주 인력에 한함)" },
    { stage: "완료", name: "국민연금, 건강보험, 노인장기요양보험료 정산", basis: "집행기준 제1장", note: "보험료 계상 시(청소, 유인경비 인력에 대한 보험료 납부)" },
    { stage: "완료", name: "보험 납입 증명확인서(산재ㆍ고용보험료)", basis: "집행기준 제1장", note: "보험료 계상 시" },
    { stage: "완료", name: "설계도서(도면, 시방서, 내역서, 전자파일)", basis: "", note: "건축 설계 용역 계약의 경우 징구" },
    { stage: "완료", name: "손해배상보험(공제)증서", basis: "설계·건설사업관리 용역 손해배상보험 또는 공제 업무요령", note: "건축 설계 용역 계약의 경우 징구" },
    { stage: "완료", name: "완료검사조서", basis: "지방계약법 시행령 제65조", note: "계약금액 3천만원 미만 작성 생략 가능" },
    { stage: "대가 지급", name: "대가청구서 및 세금계산서", basis: "지방계약법 시행령 제67조", note: "" },
    { stage: "대가 지급", name: "국세 납세증명서", basis: "국세징수법 시행령 제91조", note: "수의계약 시 제출 생략" },
    { stage: "대가 지급", name: "지방세 납세증명서", basis: "지방세징수법 시행령 제5조", note: "수의계약 시 제출 생략" },
    { stage: "대가 지급", name: "4대 사회보험료 완납증명서", basis: "국민연금법 제95조의2, 국민건강보험법 제81조의4, 고용산재보험료징수법 제29조의4", note: "지방회계법 시행령 38조에 따른 일상경비로 대가를 지급받는 계약 등 관계 법령에서 규정한 경우 생략 가능" },
    { stage: "대가 지급", name: "하자보수보증금(보증서)", basis: "교육시설과-1036(2011. 3. 8.)", note: "계약금액 3천만원 이상 건축 설계 용역의 경우 징구" },
  ],
  goods: [
    { stage: "품의 및 계약방법 결정", name: "품의서", basis: "학교회계 규칙 제32조", note: "품의금액 50만원 이하 전결 가능" },
    { stage: "품의 및 계약방법 결정", name: "규격(사양서), 기초금액산출내역서 등", basis: "", note: "단순 기성품 생략가능, 제조구매는 필수" },
    { stage: "공고", name: "공고서", basis: "", note: "" },
    { stage: "공고", name: "계약 일반조건", basis: "집행기준 제15장", note: "" },
    { stage: "공고", name: "계약 특수조건", basis: "", note: "필요한 경우에 한하여 작성" },
    { stage: "계약상대자(낙찰자) 결정", name: "견적서", basis: "지방계약법 시행규칙 제33조", note: "추정가격 2백만원 미만 수의계약 생략 가능(2019. 6. 25. 개정)" },
    { stage: "계약상대자(낙찰자) 결정", name: "적격심사 서류(입찰시)", basis: "낙찰자 결정기준 제2장", note: "입찰 시에만 징구" },
    { stage: "계약상대자(낙찰자) 결정", name: "소기업, 소상공인 확인서 / 중기업 확인서", basis: "판로지원법 시행령 제2조의2, 지방계약법 시행령 제25조제1항제5호다목", note: "관련 법에 따라 입찰 자격(입찰 제한내용) 확인. 2인이상 견적서 제출 수의계약시 징구(추정가격 2천만원 이하시 생략 가능). 공공구매종합정보(SMPP) 확인시 징구 생략 가능" },
    { stage: "계약상대자(낙찰자) 결정", name: "직접생산증명서", basis: "판로지원법 제9조", note: "중소기업자간 경쟁제품 추정가격 1천만원 미만 수의계약 시 생략(입찰 시에는 계약금액과 상관없이 확인 필요). 공공구매종합정보(SMPP) 확인시 징구 생략 가능" },
    { stage: "계약 체결", name: "계약서", basis: "지방계약법 시행령 제50조", note: "계약금액 5천만원 이하 작성 생략(승낙사항 등으로 대체) 가능" },
    { stage: "계약 체결", name: "승낙사항", basis: "학교회계 규칙 제32조의2", note: "계약금액 1백만원 이하 승낙사항은 공급자 날인 생략 가능" },
    { stage: "계약 체결", name: "산출내역서", basis: "", note: "견적서 등으로 내역을 확인할 수 있는 경우 생략 가능" },
    { stage: "계약 체결", name: "계약보증금(보증서, 지급 확약서)", basis: "지방계약법 시행령 제53조", note: "계약금액 5천만원 이하 면제 가능(단, 지급 확약서는 징구). 지급 확약서는 계약서 작성 시에만 징구(계약서 미작성 시 승낙사항으로 대체)" },
    { stage: "계약 체결", name: "인지세", basis: "인지세법 제3조", note: "계약금액 1천만원 이하 해당없음. 물품(유통 중인 규격 물품) 구매 제외" },
    { stage: "계약 체결", name: "사업자등록증 사본", basis: "", note: "G2B 등록정보로 대체 가능. 사업자등록번호 등으로 사업자등록사항이 확인되는 경우 생략" },
    { stage: "계약 체결", name: "등기사항전부증명서(법인등기부등본)", basis: "", note: "필요한 경우만 징구" },
    { stage: "계약 체결", name: "사용인감계", basis: "", note: "G2B 경쟁입찰참가자격등록증 등으로 대체 가능" },
    { stage: "계약 체결", name: "청렴서약서", basis: "지방계약법 제6조의2", note: "현장 단순구매 생략 가능(카드결제)" },
    { stage: "계약 체결", name: "수의계약 체결제한 여부 확인서", basis: "공직자의 이해충돌방지법 제12조", note: "" },
    { stage: "계약 체결", name: "수의계약 각서", basis: "집행기준 제5장", note: "" },
    { stage: "계약 체결", name: "조세포탈 서약서", basis: "지방계약법 제31조의5 및 시행령 제93조", note: "" },
    { stage: "계약 체결", name: "보안 각서", basis: "", note: "개인정보 보호가 필요한 계약시 징구(졸업앨범 등)" },
    { stage: "계약 체결", name: "계좌 사본(예금주 확인)", basis: "", note: "다른 서류 등으로 실명계좌 확인만 가능하면 생략 가능" },
    { stage: "계약 체결", name: "기타 개별법령에 의한 서류", basis: "", note: "특정물품 해당(급식 식재료 계약 등 개별 법령 확인)" },
    { stage: "완료", name: "완료검사조서", basis: "지방계약법 시행령 제65조", note: "계약금액 3천만원 미만 생략 가능" },
    { stage: "대가 지급", name: "대가청구서 및 세금계산서", basis: "지방계약법 시행령 제67조", note: "" },
    { stage: "대가 지급", name: "국세 납세증명서", basis: "국세징수법 시행령 제91조", note: "수의계약 시 제출 생략" },
    { stage: "대가 지급", name: "지방세 납세증명서", basis: "지방세징수법 시행령 제5조", note: "수의계약 시 제출 생략" },
    { stage: "대가 지급", name: "4대 사회보험료 완납증명서", basis: "국민연금법 제95조의2, 국민건강보험법 제81조의4, 고용산재보험료징수법 제29조의4", note: "지방회계법 시행령 38조에 따른 일상경비로 대가를 지급받는 계약 등 관계 법령에서 규정한 경우 생략 가능" },
    { stage: "대가 지급", name: "하자보수보증금(보증서)", basis: "지방계약법 시행령 제71조", note: "계약의 성질상 필요한 경우" },
  ],
};

const manualAliases = {
  "품의서": ["품의"],
  "설계서": ["시방서", "도면", "설계도서"],
  "기초금액 산출내역서(과업내용서 포함)": ["과업내용서", "기초금액", "산출내역서"],
  "규격(사양서), 기초금액산출내역서 등": ["규격서", "사양서", "기초금액", "산출내역서"],
  "계약 일반조건": ["일반조건"],
  "계약 특수조건": ["특수조건"],
  "적격심사 서류": ["적격심사"],
  "적격심사 서류(입찰시)": ["적격심사"],
  "계약보증금(보증서, 지급확약서)": ["계약보증서", "계약보증금", "지급확약서", "계약보증금지급확약서"],
  "계약보증금(보증서, 지급 확약서)": ["계약보증서", "계약보증금", "지급확약서", "계약보증금지급확약서"],
  "공사 면허 등록증, 등록수첩": ["건설업등록증", "면허등록증", "등록수첩", "공사업등록증"],
  "사업자등록증 사본": ["사업자등록증"],
  "등기사항전부증명서(법인등기부등본)": ["등기사항전부증명서", "법인등기부등본", "등기부등본"],
  "수의계약 체결제한 여부 확인서": ["수의계약체결제한여부확인서", "체결제한여부확인서", "이해충돌방지법", "수의계약통합서약서", "통합서약서"],
  "수의계약 각서": ["수의계약각서", "수의계약통합서약서", "통합서약서"],
  "조세포탈 서약서": ["조세포탈", "조세포탈여부확인서약서", "제31조의5", "서약서", "수의계약통합서약서", "통합서약서"],
  "계좌 사본(예금주 확인)": ["계좌사본", "통장사본", "예금주"],
  "착공신고서(착공계)": ["착공계", "착공신고서"],
  "현장기술자 지정신고서": ["현장기술자", "기술자지정"],
  "공사공정예정표": ["공정예정표", "예정공정표"],
  "착공 전 현장사진": ["착공사진", "공사전사진", "현장사진"],
  "직접시공계획서": ["직접시공"],
  "전기, 수도료 납부 합의서(또는 미사용 각서)": ["전기수도료", "수도료", "미사용각서", "납부합의서"],
  "노무비 구분관리 및 지급확인제 합의서": ["노무비구분관리", "지급확인제", "적용제외확인서"],
  "공사(용역)안전·보건 체크리스트": ["안전보건체크리스트", "공사용역안전보건", "안전·보건"],
  "준공계": ["준공신고서"],
  "준공검사원(의뢰서)": ["준공검사원", "준공검사의뢰서"],
  "준공내역서ㆍ준공정산동의서": ["준공내역서", "준공정산동의서"],
  "산업안전보건관리비 집행내역": ["산업안전보건관리비", "안전보건관리비"],
  "환경보전비 집행내역": ["환경보전비"],
  "보험 납입 증명확인서": ["보험납입", "납입증명확인서", "보험료납부"],
  "건설근로자 퇴직공제부금 납부확인서": ["퇴직공제부금", "건설근로자"],
  "폐기물 처리 관련 서류[계약금액에 반영 시 - 정산항목]": ["폐기물처리", "계량증명서", "올바로", "인계서"],
  "준공 사진": ["준공사진", "마감사진"],
  "준공검사조서": ["준공검사조서"],
  "대가청구서 및 세금계산서": ["대가청구서", "세금계산서", "청구서"],
  "국세 납세증명서": ["국세납세증명", "국세완납"],
  "지방세 납세증명서": ["지방세납세증명", "지방세완납"],
  "4대 사회보험료 완납증명서": ["4대보험", "사회보험료완납", "완납증명서"],
  "하자보수보증금(보증서)": ["하자보수보증서", "하자보증서", "하자보수보증금"],
  "노무비 지급내역서": ["노무비지급내역", "노무비내역"],
  "소기업, 소상공인 확인서 / 중기업 확인서": ["소기업확인서", "소상공인확인서", "중기업확인서", "중소기업확인서"],
  "직접생산증명서": ["직접생산", "직생"],
  "자격(인가,허가,면허)등, 등록(신고)필증": ["자격", "인가", "허가", "면허", "등록필증", "신고필증"],
  "청렴서약서": ["청렴계약이행서약서", "청렴이행서약서", "청렴계약", "수의계약통합서약서", "통합서약서"],
  "근로조건이행 확약서": ["근로조건이행", "근로자권리보호"],
  "보안각서": ["보안각서"],
  "보안 각서": ["보안각서"],
  "손해배상보험(공제)증서": ["손해배상보험", "손해배상공제", "공제증서"],
  "착수신고서": ["착수계", "착수신고서"],
  "용역 종사자 노무비 지급 확약서": ["노무비지급확약서", "용역종사자"],
  "감시단속적 근로자에 대한 적용 제외 승인서": ["감시단속적", "적용제외승인서"],
  "책임기술자 선임계 및 참여기술자 명단": ["책임기술자", "참여기술자", "선임계"],
  "완료신고서": ["완료계", "완료신고서"],
  "근로자 급여지급내역서": ["급여지급내역", "근로자급여"],
  "국민연금, 건강보험, 노인장기요양보험료 정산": ["보험료정산", "국민연금", "건강보험", "노인장기요양"],
  "보험 납입 증명확인서(산재ㆍ고용보험료)": ["보험납입", "산재", "고용보험", "납입증명확인서"],
  "설계도서(도면, 시방서, 내역서, 전자파일)": ["설계도서", "도면", "시방서", "내역서", "전자파일"],
  "완료검사조서": ["완료검사조서", "검사조서"],
  "기타 개별법령에 의한 서류": ["개별법령", "급식식재료"],
};

let state = loadState();
let transientFiles = new Map();
let saveTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function normalizeText(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[\s\-_.·ㆍ,()\[\]{}<>《》「」『』:;\/\\|~!@#$%^&*+=?"'`]/g, "");
}

function getDocId(type, index) {
  return `${type}-${index}`;
}

function getDocById(docId) {
  const [type, indexText] = docId.split("-");
  const index = Number(indexText);
  return checklistData[type]?.[index] ? { type, index, doc: checklistData[type][index] } : null;
}

function getDocState(docId) {
  if (!state.docs[docId]) state.docs[docId] = { status: "미확인", note: "", files: [] };
  if (!state.docs[docId].files) state.docs[docId].files = [];
  return state.docs[docId];
}

function loadState() {
  const base = { activeType: "construction", info: {}, docs: {}, files: [], collapsed: {} };
  try {
    const raw = localStorage.getItem(APP_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return { ...base, ...parsed, info: parsed.info || {}, docs: parsed.docs || {}, files: parsed.files || [], collapsed: parsed.collapsed || {} };
  } catch (error) {
    console.warn("저장상태를 불러오지 못했습니다.", error);
    return base;
  }
}

function persistState() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
    const indicator = $("#saveIndicator");
    if (indicator) {
      indicator.textContent = "자동저장 완료";
      window.setTimeout(() => { indicator.textContent = "자동저장 대기"; }, 1000);
    }
  }, 150);
}

function init() {
  setupPdfJs();
  bindEvents();
  hydrateInfoForm();
  renderAll();
}

function setupPdfJs() {
  window.addEventListener("load", () => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
  });
}

function bindEvents() {
  $$(".type-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.activeType = tab.dataset.type;
      state.info.stageFilter = "전체";
      persistState();
      hydrateInfoForm();
      renderAll();
    });
  });

  $("#infoForm").addEventListener("input", (event) => {
    const target = event.target;
    if (!target.name) return;
    state.info[target.name] = target.value;
    persistState();
    if (target.name === "stageFilter") renderChecklist();
    renderSummary();
  });

  $("#chooseFileBtn").addEventListener("click", () => $("#fileInput").click());
  $("#fileInput").addEventListener("change", (event) => handleFiles(event.target.files));

  const dropzone = $("#dropzone");
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });
  dropzone.addEventListener("drop", (event) => handleFiles(event.dataTransfer.files));
  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      $("#fileInput").click();
    }
  });

  $("#copyResultBtn").addEventListener("click", copyResult);
  $("#printBtn").addEventListener("click", () => {
    renderPrintReport();
    window.print();
  });
  $("#exportJsonBtn").addEventListener("click", exportJson);
  $("#importJsonInput").addEventListener("change", importJson);
  $("#resetBtn").addEventListener("click", resetAll);
  $("#expandAllBtn").addEventListener("click", toggleExpandAll);
}

function hydrateInfoForm() {
  const form = $("#infoForm");
  const fields = ["title", "vendor", "amount", "method", "contractWritten", "stageFilter", "memo"];
  fields.forEach((field) => {
    const input = form.elements[field];
    if (input) input.value = state.info[field] || (field === "stageFilter" ? "전체" : "");
  });
}

function renderAll() {
  renderTabs();
  renderStageFilter();
  renderChecklist();
  renderFiles();
  renderSummary();
  renderPrintReport();
}

function renderTabs() {
  $$(".type-tab").forEach((tab) => {
    const isActive = tab.dataset.type === state.activeType;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  $("#activeTypeLabel").textContent = TYPE_LABELS[state.activeType];
  $("#checklistTitle").textContent = `${TYPE_LABELS[state.activeType]} 계약 구비서류`;
}

function getStages(type = state.activeType) {
  return [...new Set(checklistData[type].map((item) => item.stage))];
}

function renderStageFilter() {
  const select = $("#stageFilter");
  const current = state.info.stageFilter || "전체";
  const options = ["전체", ...getStages()];
  select.innerHTML = options.map((stage) => `<option value="${escapeHtml(stage)}">${escapeHtml(stage)}</option>`).join("");
  select.value = options.includes(current) ? current : "전체";
  state.info.stageFilter = select.value;
}

function renderChecklist() {
  const container = $("#checklistContainer");
  const type = state.activeType;
  const stageFilter = state.info.stageFilter || "전체";
  const rows = checklistData[type]
    .map((doc, index) => ({ doc, index, docId: getDocId(type, index) }))
    .filter(({ doc }) => stageFilter === "전체" || doc.stage === stageFilter);

  if (!rows.length) {
    container.innerHTML = `<div class="empty-state">표시할 서류가 없습니다.</div>`;
    return;
  }

  const groups = groupBy(rows, (item) => item.doc.stage);
  container.innerHTML = Object.entries(groups).map(([stage, items]) => {
    const key = `${type}:${stage}`;
    const isCollapsed = state.collapsed[key] === true;
    const doneCount = items.filter(({ docId }) => DONE_STATUSES.has(getDocState(docId).status)).length;
    return `
      <section class="stage-group ${isCollapsed ? "collapsed" : ""}" data-stage-key="${escapeAttr(key)}">
        <button class="stage-header" type="button" data-action="toggle-stage">
          <strong>${escapeHtml(stage)}</strong>
          <span>${doneCount}/${items.length} 확인 <span class="chevron">▾</span></span>
        </button>
        <div class="stage-body">
          ${items.map(({ doc, index, docId }) => renderDocCard(doc, index, docId)).join("")}
        </div>
      </section>
    `;
  }).join("");

  $$('[data-action="toggle-stage"]', container).forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".stage-group");
      const key = group.dataset.stageKey;
      state.collapsed[key] = !state.collapsed[key];
      persistState();
      group.classList.toggle("collapsed", state.collapsed[key]);
    });
  });

  $$(".doc-card", container).forEach((card) => bindDocCardEvents(card));
}

function renderDocCard(doc, index, docId) {
  const docState = getDocState(docId);
  const status = docState.status || "미확인";
  const files = docState.files || [];
  const displayNote = getDocNote(doc);
  return `
    <article class="doc-card status-${escapeAttr(status)}" data-doc-id="${escapeAttr(docId)}">
      <div class="doc-head">
        <div class="doc-title-wrap">
          <div class="doc-name">${index + 1}. ${escapeHtml(doc.name)}</div>
          <div class="doc-detail">
            ${doc.basis ? `<div><b>근거</b> ${escapeHtml(doc.basis)}</div>` : ""}
            ${displayNote ? `<div><b>비고</b> ${escapeHtml(displayNote)}</div>` : ""}
          </div>
        </div>
        <span class="status-pill" data-status="${escapeAttr(status)}">${escapeHtml(status)}</span>
      </div>
      <div class="doc-buttons" role="group" aria-label="${escapeAttr(doc.name)} 상태 변경">
        ${["확인완료", "생략가능", "해당없음", "보류"].map((statusName) => `
          <button type="button" class="${status === statusName ? "active" : ""}" data-status-set="${escapeAttr(statusName)}">${escapeHtml(statusName)}</button>
        `).join("")}
        <button type="button" class="reset-status" data-status-set="미확인">초기화</button>
      </div>
      <div class="file-chips">
        ${files.length ? files.map((fileName) => `
          <span class="file-chip" title="${escapeAttr(fileName)}">📎 ${escapeHtml(fileName)} <button type="button" data-remove-file="${escapeAttr(fileName)}" aria-label="첨부 연결 해제">×</button></span>
        `).join("") : `<span class="file-meta">연결된 파일 없음</span>`}
      </div>
      <div class="doc-note-row">
        <textarea class="doc-note" rows="1" placeholder="담당자 메모" aria-label="${escapeAttr(doc.name)} 담당자 메모">${escapeHtml(docState.note || "")}</textarea>
      </div>
    </article>
  `;
}

function bindDocCardEvents(card) {
  const docId = card.dataset.docId;
  $$('[data-status-set]', card).forEach((button) => {
    button.addEventListener("click", () => {
      const docState = getDocState(docId);
      docState.status = button.dataset.statusSet;
      persistState();
      renderChecklist();
      renderSummary();
      renderPrintReport();
    });
  });
  $$("[data-remove-file]", card).forEach((button) => {
    button.addEventListener("click", () => {
      const fileName = button.dataset.removeFile;
      const docState = getDocState(docId);
      docState.files = (docState.files || []).filter((name) => name !== fileName);
      if (docState.status === "첨부확인" && docState.files.length === 0) docState.status = "미확인";
      state.files.forEach((file) => {
        if (file.name !== fileName) return;
        const ids = getMatchedDocIds(file);
        if (!ids.includes(docId)) return;
        const nextIds = ids.filter((id) => id !== docId);
        file.matchedDocIds = nextIds;
        file.matchedDocId = nextIds[0] || "";
        file.applied = nextIds.length > 0;
        file.status = nextIds.length ? file.status : "연결 해제";
      });
      persistState();
      renderAll();
    });
  });
  $(".doc-note", card).addEventListener("input", (event) => {
    getDocState(docId).note = event.target.value;
    persistState();
    renderPrintReport();
  });
}

function getDocNote(doc) {
  const baseNote = doc.note || "";
  if (!INTEGRATED_PLEDGE_NAMES.has(doc.name)) return baseNote;
  return [baseNote, INTEGRATED_PLEDGE_NOTE].filter(Boolean).join(" · ");
}

function renderSummary() {
  const type = state.activeType;
  const rows = checklistData[type].map((_, index) => getDocState(getDocId(type, index)));
  const counts = Object.fromEntries(STATUS_LIST.map((status) => [status, 0]));
  rows.forEach((item) => { counts[item.status || "미확인"] += 1; });
  const total = rows.length;
  const done = rows.filter((item) => DONE_STATUSES.has(item.status)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  $("#progressBar").style.width = `${percent}%`;
  $("#progressText").textContent = `${percent}%`;
  $("#summaryGrid").innerHTML = [
    ["전체", total],
    ["확인완료", counts["확인완료"]],
    ["첨부확인", counts["첨부확인"]],
    ["생략가능", counts["생략가능"]],
    ["해당없음", counts["해당없음"]],
    ["미확인", counts["미확인"]],
    ["보류", counts["보류"]],
  ].map(([label, value]) => `
    <div class="summary-item">
      <span>${escapeHtml(label)}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function handleFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  files.forEach((file) => {
    const id = makeFileId(file);
    transientFiles.set(id, file);
    const existing = state.files.find((item) => item.id === id);
    if (existing) return;

    const match = findBestMatch(file.name, state.activeType);
    const record = {
      id,
      name: file.name,
      size: file.size,
      type: file.type || getExt(file.name),
      addedAt: new Date().toISOString(),
      activeTypeAtUpload: state.activeType,
      status: "미분류",
      matchedDocId: "",
      matchedDocIds: [],
      suggestionDocId: "",
      suggestionScore: 0,
      ocrText: "",
      ocrStatus: "",
      applied: false,
    };

    if (isIntegratedPledgeText(file.name)) {
      const docIds = attachIntegratedPledgeToDocs(record.name, state.activeType);
      record.status = docIds.length ? "수의계약 통합서약서 자동반영" : "미분류";
      record.matchedDocIds = docIds;
      record.matchedDocId = docIds[0] || "";
      record.applied = docIds.length > 0;
    } else if (match && match.score >= 70) {
      record.status = "파일명 자동매칭";
      record.matchedDocId = match.docId;
      record.matchedDocIds = [match.docId];
      record.applied = true;
      attachFileToDoc(record.matchedDocId, record.name, { silent: true });
    } else if (match && match.score >= 35) {
      record.status = "추천 대기";
      record.suggestionDocId = match.docId;
      record.suggestionScore = match.score;
    }

    state.files.unshift(record);
  });

  persistState();
  renderAll();
  toast(`${files.length}개 파일을 확인했어요.`);

  autoOcrUnmatched(files).catch((error) => {
    console.warn(error);
    toast("일부 OCR 확인에 실패했어요. 수동 연결은 가능해요.");
  });
}

async function autoOcrUnmatched(files) {
  for (const file of files) {
    const id = makeFileId(file);
    const record = state.files.find((item) => item.id === id);
    if (!record || record.applied || record.ocrText) continue;
    if (!isOcrCandidate(file)) continue;

    record.ocrStatus = "OCR 확인 중...";
    record.status = record.status === "미분류" ? "OCR 확인 중" : record.status;
    persistState();
    renderFiles();

    try {
      const text = await extractTitleText(file);
      record.ocrText = text.slice(0, 1000);
      if (isIntegratedPledgeText(record.ocrText)) {
        const docIds = attachIntegratedPledgeToDocs(record.name, state.activeType);
        record.matchedDocIds = docIds;
        record.matchedDocId = docIds[0] || "";
        record.applied = docIds.length > 0;
        record.status = docIds.length ? "수의계약 통합서약서 OCR 반영" : "미분류";
        record.ocrStatus = docIds.length ? "수의계약 통합서약서 제목 확인" : "제목 확인 실패";
        persistState();
        renderAll();
        continue;
      }
      const match = findBestMatch(record.ocrText, state.activeType);
      if (match && match.score >= 45) {
        record.suggestionDocId = match.docId;
        record.suggestionScore = match.score;
        record.status = "OCR 추천";
        record.ocrStatus = "OCR 제목 추천 완료";
      } else {
        record.status = "미분류";
        record.ocrStatus = "제목 확인 실패";
      }
    } catch (error) {
      console.warn("OCR 실패", error);
      record.status = "미분류";
      record.ocrStatus = "OCR 사용 불가 또는 실패";
    }
    persistState();
    renderFiles();
  }
}

function renderFiles() {
  const list = $("#fileList");
  if (!state.files.length) {
    list.innerHTML = `<div class="empty-state">아직 첨부한 파일이 없습니다. 파일 첨부 없이도 아래 체크리스트에서 직접 확인할 수 있어요.</div>`;
    return;
  }

  list.innerHTML = state.files.map((file) => renderFileCard(file)).join("");

  $$("[data-apply-suggestion]", list).forEach((button) => {
    button.addEventListener("click", () => {
      const file = getFileRecord(button.dataset.applySuggestion);
      if (!file || !file.suggestionDocId) return;
      file.matchedDocId = file.suggestionDocId;
      file.matchedDocIds = [file.suggestionDocId];
      file.applied = true;
      file.status = file.status.includes("OCR") ? "OCR 추천 적용" : "추천 적용";
      attachFileToDoc(file.matchedDocId, file.name, { silent: true });
      persistState();
      renderAll();
    });
  });

  $$("[data-run-ocr]", list).forEach((button) => {
    button.addEventListener("click", async () => {
      const fileId = button.dataset.runOcr;
      const file = transientFiles.get(fileId);
      const record = getFileRecord(fileId);
      if (!file || !record) {
        toast("새로고침 후에는 보안상 원본 파일을 다시 선택해야 OCR이 가능해요.");
        return;
      }
      await autoOcrUnmatched([file]);
    });
  });

  $$("[data-remove-upload]", list).forEach((button) => {
    button.addEventListener("click", () => removeUpload(button.dataset.removeUpload));
  });

  $$("[data-manual-connect]", list).forEach((button) => {
    button.addEventListener("click", () => {
      const fileId = button.dataset.manualConnect;
      const select = button.closest(".file-card")?.querySelector(".manual-select");
      const docId = select?.value;
      const file = getFileRecord(fileId);
      if (!file || !docId) return;
      file.matchedDocId = docId;
      file.matchedDocIds = [docId];
      file.applied = true;
      file.status = "수동 연결";
      attachFileToDoc(docId, file.name, { silent: true });
      persistState();
      renderAll();
    });
  });
}

function renderFileCard(file) {
  const suggestion = file.suggestionDocId ? getDocById(file.suggestionDocId) : null;
  const matchedDocIds = getMatchedDocIds(file);
  const matched = matchedDocIds.length === 1 ? getDocById(matchedDocIds[0]) : null;
  const canOcr = transientFiles.has(file.id) && isOcrCandidate(transientFiles.get(file.id));
  const options = checklistData[state.activeType].map((doc, index) => {
    const docId = getDocId(state.activeType, index);
    return `<option value="${escapeAttr(docId)}">${escapeHtml(`${doc.stage} · ${doc.name}`)}</option>`;
  }).join("");

  return `
    <article class="file-card">
      <div>
        <div class="file-card__title">
          <span class="file-name">${escapeHtml(file.name)}</span>
          <span class="status-pill" data-status="${escapeAttr(file.applied ? "첨부확인" : (file.status.includes("미분류") ? "미확인" : "보류"))}">${escapeHtml(file.status)}</span>
        </div>
        <p class="file-meta">
          ${formatBytes(file.size)} · ${escapeHtml(file.type || "파일")}
          ${matched ? `<br>연결됨: ${escapeHtml(TYPE_LABELS[matched.type])} · ${escapeHtml(matched.doc.stage)} · ${escapeHtml(matched.doc.name)}` : ""}
          ${matchedDocIds.length > 1 ? `<br>연결됨: ${escapeHtml(TYPE_LABELS[file.activeTypeAtUpload] || TYPE_LABELS[state.activeType])} · 수의계약 통합서약서 대체 서류 ${matchedDocIds.length}개` : ""}
          ${suggestion && !file.applied ? `<br>추천: ${escapeHtml(suggestion.doc.stage)} · ${escapeHtml(suggestion.doc.name)} (${file.suggestionScore}점)` : ""}
          ${file.ocrStatus ? `<br>OCR: ${escapeHtml(file.ocrStatus)}` : ""}
        </p>
      </div>
      <div class="file-actions">
        ${suggestion && !file.applied ? `<button type="button" class="primary" data-apply-suggestion="${escapeAttr(file.id)}">추천 적용</button>` : ""}
        ${canOcr && !file.applied ? `<button type="button" class="soft" data-run-ocr="${escapeAttr(file.id)}">OCR 다시 확인</button>` : ""}
        <button type="button" data-remove-upload="${escapeAttr(file.id)}">목록 삭제</button>
      </div>
      <div class="manual-connect">
        <select class="manual-select" data-manual-select="${escapeAttr(file.id)}">
          <option value="">수동으로 연결할 서류 선택</option>
          ${options}
        </select>
        <button type="button" class="ghost-button" data-manual-connect="${escapeAttr(file.id)}">연결</button>
      </div>
    </article>
  `;
}

function attachFileToDoc(docId, fileName, options = {}) {
  const docState = getDocState(docId);
  if (!docState.files.includes(fileName)) docState.files.push(fileName);
  docState.status = "첨부확인";
  if (!options.silent) toast("서류에 파일을 연결했어요.");
}

function attachIntegratedPledgeToDocs(fileName, type = state.activeType) {
  const docIds = checklistData[type]
    .map((doc, index) => ({ doc, docId: getDocId(type, index) }))
    .filter(({ doc }) => INTEGRATED_PLEDGE_NAMES.has(doc.name))
    .map(({ docId }) => docId);
  docIds.forEach((docId) => attachFileToDoc(docId, fileName, { silent: true }));
  return docIds;
}

function getMatchedDocIds(file) {
  const ids = Array.isArray(file?.matchedDocIds) ? file.matchedDocIds : [];
  if (file?.matchedDocId && !ids.includes(file.matchedDocId)) ids.unshift(file.matchedDocId);
  return [...new Set(ids.filter(Boolean))];
}

function isIntegratedPledgeText(text = "") {
  const normalized = normalizeText(text);
  if (!normalized) return false;
  return normalized.includes("수의계약통합서약서") ||
    normalized.includes("계약이행통합서약서") ||
    normalized.includes("통합서약서") ||
    (normalized.includes("수의계약각서") && normalized.includes("체결제한") && normalized.includes("청렴계약") && normalized.includes("조세포탈"));
}

function removeUpload(fileId) {
  const record = getFileRecord(fileId);
  getMatchedDocIds(record).forEach((docId) => {
    const docState = getDocState(docId);
    docState.files = (docState.files || []).filter((name) => name !== record.name);
    if (docState.status === "첨부확인" && docState.files.length === 0) docState.status = "미확인";
  });
  state.files = state.files.filter((item) => item.id !== fileId);
  transientFiles.delete(fileId);
  persistState();
  renderAll();
}

function getFileRecord(fileId) {
  return state.files.find((item) => item.id === fileId);
}

function makeFileId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
}

function getExt(name) {
  return name.split(".").pop()?.toLowerCase() || "file";
}

function isOcrCandidate(file) {
  if (!file) return false;
  const ext = getExt(file.name);
  return file.type?.startsWith("image/") || ext === "pdf";
}

async function extractTitleText(file) {
  if (!window.Tesseract) throw new Error("Tesseract.js를 불러오지 못했습니다.");
  const image = file.type?.startsWith("image/") ? await imageFileToDataUrl(file) : await firstPdfPageToCanvas(file);
  const result = await window.Tesseract.recognize(image, "kor+eng", {
    logger: () => {},
  });
  return (result?.data?.text || "").trim();
}

function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function firstPdfPageToCanvas(file) {
  if (!window.pdfjsLib) throw new Error("PDF.js를 불러오지 못했습니다.");
  const data = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.8 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

function findBestMatch(text, type) {
  const normalized = normalizeText(text);
  if (!normalized) return null;
  let best = null;

  checklistData[type].forEach((doc, index) => {
    const docId = getDocId(type, index);
    const terms = buildTerms(doc.name);
    let score = 0;

    terms.forEach((term) => {
      const normTerm = normalizeText(term);
      if (!normTerm || normTerm.length < 2) return;
      if (normalized.includes(normTerm)) score = Math.max(score, normTerm.length > 8 ? 92 : 74);
      if (normTerm.includes(normalized) && normalized.length > 4) score = Math.max(score, 55);
    });

    const tokens = buildTokens(doc.name);
    const tokenHits = tokens.filter((token) => normalized.includes(normalizeText(token)));
    if (tokens.length >= 2 && tokenHits.length >= Math.ceil(tokens.length * 0.65)) {
      score = Math.max(score, 42 + tokenHits.length * 6);
    } else if (tokenHits.length >= 2) {
      score = Math.max(score, 30 + tokenHits.length * 5);
    }

    const cautionPenalty = applyOverMatchPenalty(doc.name, normalized);
    score = Math.max(0, score - cautionPenalty);

    if (!best || score > best.score) best = { docId, score, doc };
  });

  return best?.score > 0 ? best : null;
}

function buildTerms(name) {
  const base = [name, removeParen(name), ...splitDocName(name), ...(manualAliases[name] || [])];
  return [...new Set(base.filter(Boolean))];
}

function buildTokens(name) {
  return buildTerms(name)
    .flatMap((term) => term.split(/[\s,\/ㆍ·\[\]()]+/g))
    .map((token) => token.trim())
    .filter((token) => normalizeText(token).length >= 3)
    .filter((token) => !["서류", "사본", "확인", "계약", "증서", "각서"].includes(token));
}

function removeParen(text) {
  return text.replace(/\([^)]*\)/g, "").replace(/\[[^\]]*\]/g, "").trim();
}

function splitDocName(name) {
  return name
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .split(/[\/ㆍ·,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function applyOverMatchPenalty(name, normalizedText) {
  const normName = normalizeText(name);
  if (normName === "계약서" && /청렴서약서|조세포탈서약서|계약보증|수의계약/.test(normalizedText)) return 50;
  if (normName === "인지세" && /납세|지방세|국세/.test(normalizedText)) return 30;
  if (normName === "견적서" && /산출내역서|내역서/.test(normalizedText)) return 18;
  return 0;
}

function groupBy(items, keyGetter) {
  return items.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function generateResultText() {
  const type = state.activeType;
  const label = TYPE_LABELS[type];
  const info = state.info;
  const rows = checklistData[type].map((doc, index) => {
    const docState = getDocState(getDocId(type, index));
    return { doc, index, state: docState };
  });
  const pending = rows.filter((row) => ["미확인", "보류"].includes(row.state.status));

  const lines = [];
  lines.push(`계약콕검 확인결과`);
  lines.push(`- 기준: 서울특별시교육청 계약업무 처리지침(2023.12.27. 개정) [붙임4] 계약 구비서류`);
  lines.push(`- 계약유형: ${label}`);
  lines.push(`- 계약명: ${info.title || ""}`);
  lines.push(`- 업체명: ${info.vendor || ""}`);
  lines.push(`- 계약금액: ${info.amount || ""}`);
  lines.push(`- 계약방법: ${info.method || ""}`);
  lines.push(`- 확인일: ${formatDate(new Date())}`);
  lines.push("");
  lines.push(`[미확인/보류 서류]`);
  if (pending.length) {
    pending.forEach((row) => lines.push(`- ${row.doc.stage} / ${row.doc.name}: ${row.state.status}`));
  } else {
    lines.push("- 없음");
  }
  lines.push("");
  lines.push(`[전체 서류 상태]`);
  rows.forEach((row) => {
    const fileText = row.state.files?.length ? ` / 첨부: ${row.state.files.join(", ")}` : "";
    const memoText = row.state.note ? ` / 메모: ${row.state.note}` : "";
    lines.push(`- ${row.index + 1}. ${row.doc.stage} / ${row.doc.name}: ${row.state.status}${fileText}${memoText}`);
  });
  return lines.join("\n");
}

async function copyResult() {
  const text = generateResultText();
  try {
    await navigator.clipboard.writeText(text);
    toast("확인결과를 복사했어요.");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    toast("확인결과를 복사했어요.");
  }
}

function renderPrintReport() {
  const type = state.activeType;
  const label = TYPE_LABELS[type];
  const info = state.info;
  const rows = checklistData[type].map((doc, index) => {
    const docState = getDocState(getDocId(type, index));
    return { doc, index, state: docState };
  });
  const pending = rows.filter((row) => ["미확인", "보류"].includes(row.state.status));

  $("#printReport").innerHTML = `
    <h1>계약콕검 확인결과</h1>
    <p>서울특별시교육청 계약업무 처리지침(2023.12.27. 개정) [붙임4] 계약 구비서류 순서 기준</p>
    <div class="print-meta">
      <div><b>계약유형</b> ${escapeHtml(label)}</div>
      <div><b>확인일</b> ${escapeHtml(formatDate(new Date()))}</div>
      <div><b>계약명</b> ${escapeHtml(info.title || "")}</div>
      <div><b>업체명</b> ${escapeHtml(info.vendor || "")}</div>
      <div><b>계약금액</b> ${escapeHtml(info.amount || "")}</div>
      <div><b>계약방법</b> ${escapeHtml(info.method || "")}</div>
      <div><b>계약서 작성 여부</b> ${escapeHtml(info.contractWritten || "")}</div>
      <div><b>메모</b> ${escapeHtml(info.memo || "")}</div>
    </div>
    <div class="print-alert">
      <b>미확인/보류 서류</b><br>
      ${pending.length ? pending.map((row) => `${escapeHtml(row.doc.stage)} / ${escapeHtml(row.doc.name)} (${escapeHtml(row.state.status)})`).join("<br>") : "없음"}
    </div>
    <table>
      <thead><tr><th>순번</th><th>진행단계</th><th>서류명</th><th>상태</th><th>첨부파일</th><th>담당자 메모</th></tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${row.index + 1}</td>
            <td>${escapeHtml(row.doc.stage)}</td>
            <td>${escapeHtml(row.doc.name)}</td>
            <td>${escapeHtml(row.state.status)}</td>
            <td>${escapeHtml((row.state.files || []).join(", "))}</td>
            <td>${escapeHtml(row.state.note || "")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <p style="margin-top:14px;font-size:11px;">본 도구는 서울특별시교육청 계약업무 처리지침(2023.12.27. 개정) [붙임4] 기준의 서류 확인 보조도구입니다. 최신 지침과 개별 계약 조건에 따른 최종 확인은 담당자가 직접 수행해야 합니다.</p>
  `;
}

function exportJson() {
  const fileName = `계약콕검_${TYPE_LABELS[state.activeType]}_${formatDateForFile(new Date())}.json`;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("JSON 파일을 저장했어요.");
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = {
        activeType: parsed.activeType || "construction",
        info: parsed.info || {},
        docs: parsed.docs || {},
        files: parsed.files || [],
        collapsed: parsed.collapsed || {},
      };
      persistState();
      hydrateInfoForm();
      renderAll();
      toast("JSON 파일을 불러왔어요.");
    } catch {
      toast("JSON 파일을 읽지 못했어요.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

function resetAll() {
  const ok = window.confirm("현재 입력값, 체크상태, 첨부 연결 기록을 모두 초기화할까요?");
  if (!ok) return;
  state = { activeType: state.activeType, info: {}, docs: {}, files: [], collapsed: {} };
  transientFiles.clear();
  localStorage.removeItem(APP_KEY);
  hydrateInfoForm();
  renderAll();
  toast("초기화했어요.");
}

function toggleExpandAll() {
  const type = state.activeType;
  const stages = getStages(type);
  const allCollapsed = stages.every((stage) => state.collapsed[`${type}:${stage}`] === true);
  stages.forEach((stage) => { state.collapsed[`${type}:${stage}`] = !allCollapsed; });
  $("#expandAllBtn").textContent = allCollapsed ? "단계 모두 접기" : "단계 모두 펼치기";
  persistState();
  renderChecklist();
}

function formatBytes(bytes = 0) {
  if (!bytes) return "0B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)}${units[i]}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatDateForFile(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeAttr(value = "") { return escapeHtml(value); }

function toast(message) {
  let node = $(".toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "toast";
    document.body.append(node);
  }
  node.textContent = message;
  node.classList.add("show");
  window.clearTimeout(node._timer);
  node._timer = window.setTimeout(() => node.classList.remove("show"), 1800);
}

document.addEventListener("DOMContentLoaded", init);
