from pathlib import Path
import json,html
import urllib.request
source=Path('tmp/countries-source.geojson')
if not source.exists():
 source.parent.mkdir(parents=True,exist_ok=True)
 urllib.request.urlretrieve('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson',source)
features=json.loads(source.read_text(encoding='utf-8'))['features']
def xy(lon,lat):return 100+(lon-7.2)*100,140+(37.7-lat)*110
def path(geometry):
 polys=geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
 parts=[]
 for poly in polys:
  for ring in poly:
   points=[xy(*p[:2]) for p in ring];parts.append('M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in points)+' Z')
 return ' '.join(parts)
svg=['<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100"><title>Réseau de distribution SMART HOME en Tunisie</title><desc>Carte géographique de la Tunisie avec les zones Nord, Grand Tunis, Nabeul–Hammamet, Kairouan, Sousse, Monastir, Sfax et Sud.</desc><defs><clipPath id="map"><rect x="24" y="108" width="752" height="916" rx="18"/></clipPath></defs><rect width="800" height="1100" fill="#fff"/><text x="40" y="50" fill="#173e67" font-family="Arial,sans-serif" font-size="26" font-weight="700">Notre réseau en Tunisie</text><text x="40" y="80" fill="#687c8c" font-family="Arial,sans-serif" font-size="16">SMART HOME GROUP · Distribution nationale</text><g clip-path="url(#map)"><rect x="24" y="108" width="752" height="916" fill="#deedf2"/>']
for f in features:
 if f['properties']['ADMIN'] in ['Algeria','Libya','Italy']:
  svg.append(f'<path d="{path(f["geometry"])}" fill="#eeeade" stroke="#ccc6b9" stroke-width="1.2" fill-rule="evenodd"/>')
tun=next(f for f in features if f['properties']['ADMIN']=='Tunisia')
svg.append(f'<path d="{path(tun["geometry"])}" fill="#e4e9d8" stroke="#667d69" stroke-width="2" fill-rule="evenodd"/>')
svg+=['<text x="85" y="535" font-family="Arial,sans-serif" font-size="20" letter-spacing="3" fill="#939383" transform="rotate(-90 85 535)">ALGÉRIE</text>','<text x="540" y="880" font-family="Arial,sans-serif" font-size="20" letter-spacing="3" fill="#939383">LIBYE</text>','<text x="590" y="550" font-family="Arial,sans-serif" font-size="17" font-style="italic" fill="#6c98aa">Mer</text><text x="565" y="574" font-family="Arial,sans-serif" font-size="17" font-style="italic" fill="#6c98aa">Méditerranée</text>']
labels=[('Nord',9.1,36.95,140,175,'end'),('Grand Tunis',10.1815,36.8065,580,210,'start'),('Nabeul – Hammamet',10.65,36.43,550,283,'start'),('Sousse',10.63699,35.8256,580,340,'start'),('Monastir',10.8262,35.7643,580,390,'start'),('Kairouan',10.0963,35.6781,270,415,'end'),('Sfax',10.7603,34.7406,580,465,'start'),('Sud',9.3,32.65,215,750,'end')]
for label,lon,lat,tx,ty,anchor in labels:
 x,y=xy(lon,lat);endx=tx-10 if anchor=='start' else tx+10
 svg.append(f'<path d="M{x:.1f},{y:.1f} L{endx},{ty-6}" fill="none" stroke="#2458c4" stroke-width="1.4"/><circle cx="{x:.1f}" cy="{y:.1f}" r="6" fill="#2458c4" stroke="white" stroke-width="2.5"/><text x="{tx}" y="{ty}" text-anchor="{anchor}" font-family="Arial,sans-serif" font-size="18" font-weight="600" fill="#173e67" stroke="white" stroke-width="5" paint-order="stroke">{html.escape(label)}</text>')
svg+=['<g transform="translate(720 150)" fill="#173e67"><path d="M0 46V8M-6 18 0 8l6 10" stroke="#173e67" stroke-width="2" fill="none"/><text x="0" y="0" text-anchor="middle" font-family="Arial,sans-serif" font-size="15">N</text></g></g><text x="40" y="1052" font-family="Arial,sans-serif" font-size="13" fill="#687c8c">Fond géographique : Natural Earth · Repères de zones indicatifs</text><text x="40" y="1075" font-family="Arial,sans-serif" font-size="13" fill="#687c8c">Les repères ne constituent pas des adresses de magasins.</text></svg>']
Path('assets/img/sav/reseau-distribution-tunisie.svg').write_text(''.join(svg),encoding='utf-8')
p=Path('scripts/build_site.py');s=p.read_text(encoding='utf-8').replace('reseau-distribution-tunisie.png','reseau-distribution-tunisie.svg').replace('width="1086" height="1448" loading="lazy"></a><figcaption>','width="800" height="1100" loading="lazy"></a><figcaption>');s=s.replace('v=sav-network','v=geographic-map');p.write_text(s,encoding='utf-8')
p=Path('README.md');s=p.read_text(encoding='utf-8');s+='\nCarte géographique actuelle : assets/img/sav/reseau-distribution-tunisie.svg, construite à partir des contours Natural Earth 1:50m (domaine public), projection équirectangulaire adaptée aux latitudes tunisiennes. Fond mer/terres et repères géographiques des zones. Source : https://www.naturalearthdata.com/ et https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson .\n';p.write_text(s,encoding='utf-8')
