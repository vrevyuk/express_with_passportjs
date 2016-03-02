
DROP TABLE IF EXISTS `dealers`;
CREATE TABLE `dealers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `credit` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `promo_sum` int(11) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dealer_codes`;
CREATE TABLE `dealer_codes` (
  `id` int(11) NOT NULL,
  `code` varchar(15) NOT NULL,
  `expire` int(11) NOT NULL,
  `dealer` int(11) NOT NULL,
  `sum` float NOT NULL,
  `promo` int(11) NOT NULL,
  `groups` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `customer` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `dealer_money`;
CREATE TABLE `dealer_money` (
  `id` int(11) NOT NULL,
  `dealer` int(11) NOT NULL,
  `sum` float NOT NULL,
  `time_transaction` int(11) NOT NULL,
  `customer` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dealer_news`;
CREATE TABLE `dealer_news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `create_time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dealer_tariffs`;
CREATE TABLE `dealer_tariffs` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `cost` float NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `dealers`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `dealer_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);
ALTER TABLE `dealer_money`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `dealer_news`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `dealer_tariffs`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `dealers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `dealer_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1294823;
ALTER TABLE `dealer_money`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;
ALTER TABLE `dealer_news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `dealer_tariffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;SET FOREIGN_KEY_CHECKS=1;
