from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlparse, unquote
import re, concurrent.futures
root=Path(__file__).resolve().parents[1]/'targets/blackplus/clone'
files=[root/'index.html',*root.glob('assets/css/*.css')]
# The capture builder leaves CSS backgrounds and favicon URLs absolute.
refs=set()
for p in files:
 s=p.read_text()
 refs.update(re.findall(r'https://blackplus-template\.modulify\.website/[^\s\"\'<>\)]+',s))
refs={u for u in refs if re.search(r'\.(svg|png|webp|jpg|woff2?|ico)(?:\?|$)',u)}
def download(url):
 name=re.sub('[^a-zA-Z0-9._-]','',unquote(urlparse(url).path.rsplit('/',1)[-1]))
 dest=root/'assets/media'/name
 if not dest.exists():
  last=None
  for _ in range(3):
   try:dest.write_bytes(urlopen(url,timeout=30).read());break
   except Exception as e:last=e
  else:raise last
 return url,'/assets/media/'+name
pairs=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(download,refs))
for p in files:
 s=p.read_text()
 for a,b in pairs:s=s.replace(a,b)
 p.write_text(s)
print('Localized remaining background/favicon references:',len(pairs))
