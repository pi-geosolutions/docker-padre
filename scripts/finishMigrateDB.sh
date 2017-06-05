gunzip gabon_mines_geodata.gz
sed -i -E "s|gabon_mines_geodata|geodata|gm" gabon_mines_geodata
sed -i -E "s|fr_FR.UTF-8|en_US.UTF-8|gm" gabon_mines_geodata
psql -h pgis -U padre -e < gabon_mines_geodata
gunzip gabon_mines_gn2_10.gz
sed -i -E "s|gabon_mines_gn2_10|geonetwork|gm" gabon_mines_gn2_10
sed -i -E "s|fr_FR.UTF-8|en_US.UTF-8|gm" gabon_mines_gn2_10
psql -h pgis -U padre -e < gabon_mines_gn2_10
