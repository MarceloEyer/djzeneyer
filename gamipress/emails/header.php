<?php
/**
 * Dark Mode Email Template: Header
 *
 * This template can be overridden by copying it to yourtheme/gamipress/emails/header.php
 */

if (!defined('ABSPATH'))
	exit; // Exit if accessed directly
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?php echo get_bloginfo('name'); ?></title>
	<style>
		body {
			margin: 0;
			padding: 0;
			background-color: #05080c;
			font-family: 'Inter', Helvetica, Arial, sans-serif;
			color: #ffffff;
			width: 100% !important;
			-webkit-text-size-adjust: 100%;
			-ms-text-size-adjust: 100%;
		}

		.wrapper {
			width: 100%;
			table-layout: fixed;
			background-color: #05080c;
			padding-bottom: 60px;
			padding-top: 40px;
		}

		.main {
			background-color: #0a0f16;
			margin: 0 auto;
			width: 100%;
			max-width: 600px;
			border-spacing: 0;
			border-collapse: collapse;
			border: 1px solid #1a2433;
			border-radius: 24px;
			overflow: hidden;
		}

		.header {
			background: linear-gradient(135deg, #0a111b 0%, #0d1a2c 100%);
			padding: 40px 0;
			text-align: center;
			border-bottom: 2px solid #00C2FF;
		}

		.header h1 {
			margin: 0;
			font-size: 24px;
			font-weight: 800;
			letter-spacing: 2px;
			color: #00C2FF;
			text-transform: uppercase;
		}

		.content {
			padding: 40px 30px;
			line-height: 1.6;
			font-size: 16px;
			color: #cbd5e1;
		}

		.footer {
			padding: 30px;
			text-align: center;
			font-size: 11px;
			color: #475569;
			letter-spacing: 1px;
		}

		.btn {
			display: inline-block;
			padding: 14px 30px;
			background-color: #00C2FF;
			color: #ffffff;
			text-decoration: none !important;
			border-radius: 12px;
			font-weight: 800;
			text-transform: uppercase;
			letter-spacing: 2px;
			margin-top: 20px;
			box-shadow: 0 4px 15px rgba(0, 194, 255, 0.3);
		}

		h1,
		h2,
		h3 {
			color: #ffffff;
			margin-bottom: 15px;
		}

		strong {
			color: #00C2FF;
		}
	</style>
</head>

<body>
	<center class="wrapper">
		<table class="main" width="100%" cellpadding="0" cellspacing="0" border="0">
			<tr>
				<td class="header">
					<h1>DJ ZEN EYER</h1>
				</td>
			</tr>
			<tr>
				<td class="content">