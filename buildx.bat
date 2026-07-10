#!/bin/sh
cd "$(dirname "$0")"

IMAGE=rawinby/ecard-web
VERSION=${1:-latest}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Building Docker Image"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "IMAGE:    $IMAGE:$VERSION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# สร้าง builder สำหรับ multi-platform
docker buildx create --use --name multi-builder

# build multi-platform (amd64 + arm64) แล้ว push ไป Docker Hub ในคำสั่งเดียว
#  --platform linux/amd64,linux/arm64 \
docker buildx build \
  --platform linux/amd64 \
  --build-arg VERSION_NUMBER=$VERSION \
  -t $IMAGE:$VERSION \
  -f ./Dockerfile \
  --push \
  .

# ลบ builder หลัง push เสร็จเพื่อเคลียร์ resource
docker buildx rm multi-builder 2>/dev/null || true

# การใช้งาน:
# ./build.bat 1.0.2   #สั่ง Build และ Push image พร้อมระบุ version
# ./start.bat          #สั่ง Start Container



