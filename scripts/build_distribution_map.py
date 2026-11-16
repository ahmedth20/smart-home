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
tun=next(f for f in features if f['properties']['ADMIN']=='Tunisia')
outline=path(tun['geometry'])
labels=[('Nord',9.1,36.95,150,175,'end'),('Grand Tunis',10.1815,36.8065,570,210,'start'),('Nabeul – Hammamet',10.65,36.43,530,283,'start'),('Sousse',10.63699,35.8256,570,340,'start'),('Monastir',10.8262,35.7643,570,390,'start'),('Kairouan',10.0963,35.6781,255,415,'end'),('Sfax',10.7603,34.7406,570,465,'start'),('Sud',9.3,32.65,210,750,'end')]
svg=[f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100"><title>Notre réseau de distribution en Tunisie</title><desc>Carte bleue de la Tunisie aux contours géographiques Natural Earth, avec huit zones de distribution.</desc><defs><linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2458c4"/><stop offset="1" stop-color="#12439e"/></linearGradient><radialGradient id="background"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#f1f9fd"/></radialGradient><clipPath id="tunisia"><path d="{outline}" fill-rule="evenodd"/></clipPath></defs><rect width="800" height="1100" fill="url(#background)"/><text x="400" y="53" text-anchor="middle" font-family="Arial,sans-serif" font-size="40" font-weight="800" fill="#071a49">Notre réseau de distribution</text><text x="400" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" fill="#071a49">Une présence à travers la Tunisie</text><path d="{outline}" fill="url(#blue)" fill-rule="evenodd"/>''']
points=[xy(lon,lat) for _,lon,lat,*_ in labels]
svg.append('<g clip-path="url(#tunisia)" fill="none" stroke="#75d5f1" stroke-width="1.8" opacity=".85">')
for a,b in [(0,1),(0,5),(0,7),(1,2),(1,3),(1,5),(2,3),(3,4),(3,5),(4,6),(5,6),(5,7),(6,7)]:
 x1,y1=points[a];x2,y2=points[b];bend=(x1+x2)/2-35
 svg.append(f'<path d="M{x1:.1f},{y1:.1f} Q{bend:.1f},{(y1+y2)/2:.1f} {x2:.1f},{y2:.1f}"/>')
svg.append('</g>')
for label,lon,lat,tx,ty,anchor in labels:
 display_label=('<tspan x="'+str(tx)+'">Nabeul –</tspan><tspan x="'+str(tx)+'" dy="28">Hammamet</tspan>') if label=='Nabeul – Hammamet' else html.escape(label)
 x,y=xy(lon,lat);endx=tx-10 if anchor=='start' else tx+10
 svg.append(f'<path d="M{x:.1f},{y:.1f} L{endx},{ty-7}" fill="none" stroke="#243b68" stroke-width="1.7"/><circle cx="{x:.1f}" cy="{y:.1f}" r="9" fill="white" stroke="#29b9df" stroke-width="3"/><text x="{tx}" y="{ty}" text-anchor="{anchor}" font-family="Arial,sans-serif" font-size="25" font-weight="800" fill="#071a49" stroke="#f4fafd" stroke-width="5" paint-order="stroke">{display_label}</text>')
svg+=['<text x="400" y="1045" text-anchor="middle" font-family="Arial,sans-serif" font-size="29" font-weight="800" letter-spacing="2" fill="#071a49">SMART HOME GROUP</text></svg>']
Path('assets/img/sav/reseau-distribution-tunisie-bleu-v2.svg').write_text(''.join(svg),encoding='utf-8')
