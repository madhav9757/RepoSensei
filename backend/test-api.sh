BASE_URL="http://localhost:5000"

echo "=== RepoSensei API Tests ==="

echo -e "\n1. Health Check"
curl -s "$BASE_URL/api/health" | jq

echo -e "\n2. Get User Repositories"
curl -s "$BASE_URL/api/repos?username=octocat" | jq '.data[0:3]'

echo -e "\n3. Analyze Repository"
curl -s -X POST "$BASE_URL/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "https://github.com/octocat/Hello-World"}' | jq

echo -e "\n4. Get Repository Details"
curl -s "$BASE_URL/api/repos/octocat/Hello-World" | jq '.data | {name, description, language}'

echo -e "\n5. Get Pull Requests"
curl -s "$BASE_URL/api/pr/octocat/Hello-World" | jq '.data[0:2]'

echo -e "\n=== Tests Complete ==="