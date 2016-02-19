-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Фев 19 2016 г., 16:32
-- Версия сервера: 5.6.26
-- Версия PHP: 5.5.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- База данных: `dealers`
--
CREATE DATABASE IF NOT EXISTS `dealers` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `dealers`;

-- --------------------------------------------------------

--
-- Структура таблицы `codes`
--

DROP TABLE IF EXISTS `codes`;
CREATE TABLE `codes` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `expire` int(11) NOT NULL,
  `sum` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `series` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `dealer`
--

DROP TABLE IF EXISTS `dealer`;
CREATE TABLE `dealer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `credit` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `stock_discount` int(11) NOT NULL,
  `stock_sum` int(11) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `dealer`
--

INSERT INTO `dealer` (`id`, `name`, `login`, `password`, `credit`, `discount`, `stock_discount`, `stock_sum`, `token`) VALUES
(1, 'Test user', '11', '11', 100, 25, 90, 1250, '1234567890');

-- --------------------------------------------------------

--
-- Структура таблицы `money`
--

DROP TABLE IF EXISTS `money`;
CREATE TABLE `money` (
  `id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `sum` int(11) NOT NULL,
  `time_transaction` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `money`
--

INSERT INTO `money` (`id`, `dealer_id`, `sum`, `time_transaction`, `description`) VALUES
(1, 1, 10, 1455891434, 'test'),
(2, 1, -1, 1455891487, 'test2'),
(3, 1, -57, 1455894923, 'Bla bla bla bla bla bla bla'),
(4, 1, 11, 1455894928, 'Bla bla bla bla bla bla bla'),
(5, 1, -23, 1455894930, 'Bla bla bla bla bla bla bla'),
(6, 1, -22, 1455894933, 'Bla bla bla bla bla bla bla'),
(7, 1, 67, 1455894936, 'Bla bla bla bla bla bla bla'),
(8, 1, -71, 1455894938, 'Bla bla bla bla bla bla bla'),
(9, 1, 54, 1455894942, 'Bla bla bla bla bla bla bla'),
(10, 1, 21, 1455894951, 'Bla bla bla bla bla bla bla  as fsa ff ds'),
(11, 1, -64, 1455894953, 'Bla bla bla bla bla bla bla  as fsa ff ds'),
(12, 1, -60, 1455894961, 'Bla bla bla  as fsa ff ds'),
(13, 1, 14, 1455894964, 'Bla bla bla  as fsa ff ds'),
(14, 1, -27, 1455894967, 'Bla bla bla  as fsa ff ds'),
(15, 1, -40, 1455894984, 'Bla bla bla  as fsa ff ds'),
(16, 1, -17, 1455894984, 'Bla bla bla  as fsa ff ds'),
(17, 1, 19, 1455894984, 'Bla bla bla  as fsa ff ds'),
(18, 1, 19, 1455894984, 'Bla bla bla  as fsa ff ds'),
(19, 1, 90, 1455894984, 'Bla bla bla  as fsa ff ds'),
(20, 1, 36, 1455894984, 'Bla bla bla  as fsa ff ds'),
(21, 1, 7, 1455894991, 'Bla bla bla  as fsa ff ds'),
(22, 1, 50, 1455894992, 'Bla bla bla  as fsa ff ds'),
(23, 1, -7, 1455894992, 'Bla bla bla  as fsa ff ds'),
(24, 1, -87, 1455894992, 'Bla bla bla  as fsa ff ds'),
(25, 1, 9, 1455894992, 'Bla bla bla  as fsa ff ds'),
(26, 1, -38, 1455894992, 'Bla bla bla  as fsa ff ds'),
(27, 1, -78, 1455895007, 'Bla bla bla  as fsa ff ds'),
(28, 1, -61, 1455895036, 'Bla bla bla  as fsa ff ds'),
(29, 1, -40, 1455895039, 'Bla bla bla  as fsa ff ds'),
(30, 1, 57, 1455895042, 'Bla bla bla  as fsa ff ds'),
(31, 1, -66, 1455895044, 'Bla bla bla  as fsa ff ds'),
(32, 1, -68, 1455895046, 'Bla bla bla  as fsa ff ds'),
(33, 1, 18, 1455895049, 'Bla bla bla  as fsa ff ds'),
(34, 1, -31, 1455895052, 'Bla bla bla  as fsa ff ds'),
(35, 1, -10, 1455895054, 'Bla bla bla  as fsa ff ds'),
(36, 1, 400, 1455895142, 'Bla bla bla  as fsa ff ds'),
(37, 1, 400, 1455895152, 'Bla bla bla  as fsa ff ds');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `codes`
--
ALTER TABLE `codes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `dealer`
--
ALTER TABLE `dealer`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `money`
--
ALTER TABLE `money`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `codes`
--
ALTER TABLE `codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `dealer`
--
ALTER TABLE `dealer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `money`
--
ALTER TABLE `money`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;