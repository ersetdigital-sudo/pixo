-- PIXOGAMEONLINE — Seed data
-- Jalankan setelah schema.sql. Aman dijalankan berulang (skip kalau sudah ada).

-- ============ GAMES ============

insert into games (slug, name, icon_url, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, is_active, sort_order)
select 'mobile-legends', 'Mobile Legends', '/images/mobile-legends.png', '5 – 2.195 Diamond', 'User ID', '123456789', 'Zone ID', '2001', true, false, true, 1
where not exists (select 1 from games where slug = 'mobile-legends');

insert into games (slug, name, icon_url, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, is_active, sort_order)
select 'free-fire', 'Free Fire', '/images/free-fire.png', '5 – 1000 Diamond', 'User ID', '12345678', 'Server ID', '1000', false, true, true, 2
where not exists (select 1 from games where slug = 'free-fire');

insert into games (slug, name, icon_url, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, is_active, sort_order)
select 'pubg-mobile', 'PUBG Mobile', '/images/pubg-mobile.jpg', '60 – 8100 UC', 'User ID', '12345678', 'Server ID', '1000', false, true, true, 3
where not exists (select 1 from games where slug = 'pubg-mobile');

insert into games (slug, name, icon_url, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, is_active, sort_order)
select 'call-of-duty-mobile', 'Call of Duty: Mobile', '/images/call-of-duty-mobile.svg', '53 – 10800 CP', 'User ID', '12345678', 'Server ID', '1000', false, true, true, 4
where not exists (select 1 from games where slug = 'call-of-duty-mobile');

insert into games (slug, name, icon_url, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, is_active, sort_order)
select 'magic-chess-go-go', 'Magic Chess: Go Go', '/images/magic-chess-go-go.webp', '16 – 512 Diamond & Pass', 'User ID', '12345678', 'Zone ID', '2001', true, false, true, 5
where not exists (select 1 from games where slug = 'magic-chess-go-go');

-- ============ PRICING ============

-- Mobile Legends
insert into pricing (game_id, nominal_label, price, sort_order, category)
select g.id, n.label, n.price, n.sort, n.cat
from games g
cross join (values
  ('5 Diamond', 1500, 1, 'nominal'),
  ('12 Diamond', 3400, 2, 'nominal'),
  ('28 Diamond', 7600, 3, 'nominal'),
  ('86 Diamond', 22000, 4, 'nominal'),
  ('172 Diamond', 43500, 5, 'nominal'),
  ('257 Diamond', 64500, 6, 'nominal'),
  ('344 Diamond', 86000, 7, 'nominal'),
  ('706 Diamond', 172000, 8, 'nominal'),
  ('2.195 Diamond', 515000, 9, 'nominal')
) as n(label, price, sort, cat)
where g.slug = 'mobile-legends'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- Mobile Legends — Paket Spesial
insert into pricing (game_id, nominal_label, price, sort_order, category)
select g.id, n.label, n.price, n.sort, n.cat
from games g
cross join (values
  ('Weekly Diamond Pass', 27000, 10, 'pass'),
  ('Twilight Pass', 145000, 11, 'pass'),
  ('Starlight Member', 149000, 12, 'pass')
) as n(label, price, sort, cat)
where g.slug = 'mobile-legends'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- Free Fire
insert into pricing (game_id, nominal_label, price, sort_order)
select g.id, n.label, n.price, n.sort
from games g
cross join (values
  ('5 Diamond', 1500, 1),
  ('12 Diamond', 2900, 2),
  ('50 Diamond', 8500, 3),
  ('70 Diamond', 11500, 4),
  ('100 Diamond', 16000, 5),
  ('140 Diamond', 22000, 6),
  ('355 Diamond', 52000, 7),
  ('720 Diamond', 103000, 8),
  ('1000 Diamond', 142000, 9)
) as n(label, price, sort)
where g.slug = 'free-fire'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- PUBG Mobile
insert into pricing (game_id, nominal_label, price, sort_order)
select g.id, n.label, n.price, n.sort
from games g
cross join (values
  ('60 UC', 15000, 1),
  ('120 UC', 29000, 2),
  ('180 UC', 43000, 3),
  ('325 UC', 72000, 4),
  ('660 UC', 143000, 5),
  ('985 UC', 212000, 6),
  ('1800 UC', 385000, 7),
  ('3850 UC', 770000, 8),
  ('8100 UC', 1540000, 9)
) as n(label, price, sort)
where g.slug = 'pubg-mobile'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- Call of Duty: Mobile
insert into pricing (game_id, nominal_label, price, sort_order)
select g.id, n.label, n.price, n.sort
from games g
cross join (values
  ('53 CP', 11000, 1),
  ('106 CP', 21000, 2),
  ('212 CP', 41000, 3),
  ('424 CP', 80000, 4),
  ('880 CP', 160000, 5),
  ('1320 CP', 238000, 6),
  ('2400 CP', 425000, 7),
  ('5000 CP', 850000, 8),
  ('10800 CP', 1700000, 9)
) as n(label, price, sort)
where g.slug = 'call-of-duty-mobile'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- Magic Chess: Go Go
insert into pricing (game_id, nominal_label, price, sort_order, category)
select g.id, n.label, n.price, n.sort, n.cat
from games g
cross join (values
  ('16 Diamond', 4500, 1, 'nominal'),
  ('32 Diamond', 8500, 2, 'nominal'),
  ('64 Diamond', 16500, 3, 'nominal'),
  ('128 Diamond', 32500, 4, 'nominal'),
  ('256 Diamond', 64000, 5, 'nominal'),
  ('512 Diamond', 127000, 6, 'nominal')
) as n(label, price, sort, cat)
where g.slug = 'magic-chess-go-go'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- Magic Chess — Paket Spesial
insert into pricing (game_id, nominal_label, price, sort_order, category)
select g.id, n.label, n.price, n.sort, n.cat
from games g
cross join (values
  ('Weekly Pass', 29000, 7, 'pass'),
  ('Season Pass', 89000, 8, 'pass'),
  ('Premium Pass', 159000, 9, 'pass')
) as n(label, price, sort, cat)
where g.slug = 'magic-chess-go-go'
and not exists (select 1 from pricing p where p.game_id = g.id and p.nominal_label = n.label);

-- ============ SETTINGS ============

insert into settings (key, value)
values ('qris_image_url', '{}'::jsonb)
on conflict (key) do nothing;

-- Whitelist email admin (GANTI sesuai kebutuhan)
insert into settings (key, value)
values ('admin_emails', '["pixogameonline@gmail.com"]')
on conflict (key) do nothing;
