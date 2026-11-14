from pathlib import Path
import xml.etree.ElementTree as ET


report_path = Path("target/site/jacoco/jacoco.xml")
if not report_path.is_file():
    raise SystemExit("Relatório JaCoCo não encontrado: target/site/jacoco/jacoco.xml")

root = ET.parse(report_path).getroot()
line_counter = next(
    (counter for counter in root.findall("counter") if counter.get("type") == "LINE"),
    None,
)
if line_counter is None:
    raise SystemExit("O relatório JaCoCo não contém a métrica de linhas.")

covered = int(line_counter.get("covered", "0"))
missed = int(line_counter.get("missed", "0"))
total = covered + missed
if total == 0:
    raise SystemExit("O relatório JaCoCo não contém linhas instrumentadas.")

percentage = round(covered * 100 / total)
print(f"Cobertura de linhas: {percentage}% ({covered}/{total})")
print(f"COVERAGE_PERCENTAGE={percentage}")
