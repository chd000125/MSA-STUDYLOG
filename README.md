### 📖 StudyLog (NSA기반 웹 어플리케이션 커뮤니티 STUDYLOG)
---


## 📘 프로젝트 진행 기간
2025.04.16(월) ~ 2025.05.16(금) (4주)


## 📌 프로젝트 개요
스터디 모집 시장이 성장하고 있지만 기존 플랫폼은 모집 기능에만 초점을 맞춰 실제 운영에서 다양한 문제가 발생합니다. 참여자 간 소통이 외부 메신저에 의존하고, 일정 관리나 학습 기록 공유 기능이 부족하여 협업 효율성과 스터디 지속성이 떨어집니다. 

StudyLog는 **스터디 모집부터 운영, 커뮤니케이션, 일정 관리까지** 학습 활동을 하나의 플랫폼에서 제공하는 웹 기반 통합 시스템입니다.  
**마이크로서비스 아키텍처(MSA)** 를 도입해 기능별 독립성과 확장성을 확보하고, 시스템 간 유기적인 연동으로 효율성을 극대화했습니다.  
이러한 설계를 통해 학습 흐름을 방해하지 않는 직관적인 UI/UX를 제공하며, 실질적인 스터디 운영에 필요한 기능을 효과적으로 지원합니다.

---

## 🛠 기술 스택
<!-- 🌐 Frontend -->
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<!-- 🖥 Backend -->
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-59666C?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)

<!-- ⚙ DevOps & Tooling -->
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

### 💪역할 분담
| 이름 | 담당 서비스 | 역할 |
|---------|-------------|----------------------------|
| 최현도 | 인프라 구축, 통합, 설계 | 프로젝트 리더, 마이크로서비스-아키텍쳐 인프라구축, 통합 인증 필터 체인 |
| 김민섭 | Board 서비스, Group 서비스 | 게시판 기능, 스터디 모집 기능, 스터디 관리 기능, 실시간 채팅 기능, 엘라스틱서치, 게시판, 그룹 페이지 작성 및 디자인, 백앤드 총괄 |
| 최소현 | user 서비스, 웹 디자인, Auth 서비스 | 유저 관리 기능, 로그인/로그아웃 기능, 관리자 기능, 전반적인 웹 디자인 및 프론트 총괄 |


## 🏗 마이크로서비스 구성

![image](https://github.com/user-attachments/assets/721d6c9b-0a96-4f17-8cbf-b214f348bd94)

| 서비스명 | 설명 | 포트 |
|----------|----------------------------|------|
| gateway-service | API 게이트웨이 | 9090 |
| user-service | 유저 생성, 조회, 수정, 삭제, 관리자 기능 | 8921 |
| auth-service | 회원가입, 로그인, 로그아웃, 이메일 인증, 토큰 발급 | 8922 |
| group-service | 스터디 모집 및 커리큘럼 관리 | 8787 |
| board-service | 자유게시판 운영 | 8123 |

---

## 🎯 해결하려는 문제 및 목표
기존 플랫폼은 **스터디 모집만 지원**하고, 운영 및 관리 기능은 외부 도구(메신저, 협업 툴 등)에 의존하는 구조입니다.  
**스터디 진행 중 발생하는 소통, 일정 관리, 학습 기록 공유 기능이 부족해 지속성이 떨어지는 문제를 해결**하기 위해, 모집과 운영 기능을 통합한 스터디 플랫폼을 개발하였습니다.

---

## ✨ 주요 기능
- **스터디 모집**: 사용자들이 스터디를 개설하고 모집글을 작성할 수 있습니다.  
- **스터디 일정 관리**: 스터디 일정을 설정하고 공유할 수 있습니다.  
- **스터디 멤버 관리**: 그룹을 구성하고 멤버를 모집 및 관리할 수 있습니다.  
- **실시간 채팅**: 스터디 내에서 원활한 커뮤니케이션을 지원합니다.  
- **자유게시판**: 스터디 관련 정보를 공유하고 협력할 수 있습니다.  

---

## 🚀 설치 및 실행 방법
### 환경 요구 사항
- Node.js 23.11.0  
- JDK 17  
- Redis 7.4.2  
- Spring Boot 3.4.4  
- MySQL 8.0.33  
- Elasticsearch  

### 설치 및 실행
#### 1. 기존 Elasticsearch 삭제
```bash
docker rm -f elasticsearch
```

#### 2. Elasticsearch 새로 설치
```bash
docker run -d --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms1g -Xmx1g" \
  docker.elastic.co/elasticsearch/elasticsearch:8.13.2
```

#### 3. 플러그인 설치 (Nori 형태소 분석기)
```bash
docker exec -it elasticsearch bin/elasticsearch-plugin install analysis-nori
```

#### 4. Elasticsearch 컨테이너 재시작
```bash
docker restart elasticsearch
```

#### 5. 프론트엔드 실행
```bash
npm install react react-dom react-router-dom axios redux react-redux hooks
npm install
npm run dev
```

---

## 🔍 기여 방법
### 🎯 코드 스타일 가이드
#### 백엔드
- Spring Boot 표준 구조  
- JPA 활용  

#### 프론트엔드
- React 함수형 컴포넌트
- Hooks + Redux Toolkit

### 📌 공통 규칙
- **카멜 케이스와 스네이크 케이스 활용**   
- **API 응답 일관성 유지**  
- **서비스/컨트롤러 역할 분리 유지**

---

## 📜 라이선스 및 문의
🚨 라이선스 및 문의 정보는 **추후 추가 예정**입니다.

