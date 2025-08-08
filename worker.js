addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const NOTION_HOSTNAME = "golden-celery-f07.notion.site"; // твой публичный Notion URL (без https://)
const NOTION_PAGE_SLUG = "234306528551805ca11fd15629e032f8"; // идентификатор страницы Notion
const CUSTOM_DOMAIN = "olyainsight.com"; // твой собственный домен

async function handleRequest(request) {
  let url = new URL(request.url);

  // Заменяем hostname и path для проксирования на Notion
  url.hostname = NOTION_HOSTNAME;
  url.pathname = "/" + NOTION_PAGE_SLUG;

  // Создаём модифицированный запрос к Notion
  const modifiedRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "follow"
  });

  // Делаем запрос к Notion
  const response = await fetch(modifiedRequest);

  // Если ответ - html, меняем в нём ссылки с Notion на твой домен
  if (response.headers.get("content-type")?.includes("text/html")) {
    let html = await response.text();
    html = html.replaceAll(NOTION_HOSTNAME, CUSTOM_DOMAIN);

    return new Response(html, {
      status: response.status,
      headers: response.headers
    });
  }

  // Иначе просто возвращаем ответ без изменений
  return response;
}

  
