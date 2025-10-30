# Managed Backend (copy of LMS-server-1030-sy)

이 디렉터리는 외부 백엔드(LMS-server-1030-sy)의 관리 사본입니다.

- 동기화: `npm run sync:backend` (기본 경로: C:\Users\user\Desktop\LMS\LMS-server-1030-sy)
- 제외: `node_modules`, `dist`, `.git` 등 빌드/캐시 폴더
- 목적: 프론트 저장소 내에서 백엔드 변경 이력 및 공유 일관성 확보

Note: 현재 프론트는 mock 기반이며, 추후 API 연동 시 여기의 코드를 기준으로 진행합니다.

