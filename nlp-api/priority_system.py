import spacy
import json
import datetime

nlp = spacy.load("en_core_web_sm")

with open("priority_system_keywords.json", "r") as file:
    keywords = json.load(file)
    negative_keywords = keywords["negative_keywords"]
    urgency_keywords = keywords["urgency_keywords"]
    urgency_phrases = keywords["urgency_phrases"]
    non_urgency_keywords = keywords["non_urgency_keywords"]
    non_urgency_phrases = keywords["non_urgency_phrases"]

def get_urgency(task):
    """
    Determine the urgency of a task based on its description, due date, and category.

    :param task: A dictionary with the task's description, due date, and category
    :return: A string indicating if the task is urgent or normal
    """
    # Check if the description contains any non-urgency phrases
    doc = nlp(task["description"].lower())
    if any(phrase in doc.text for phrase in non_urgency_phrases):
        return "normal"

    # Check if the description contains any urgency keywords
    for token in doc:
        if token.lemma_ in non_urgency_keywords:
            return "normal"
        if token.lemma_ in urgency_keywords:
            # Check if the urgency keyword is not negated
            if all(child.lemma_ not in negative_keywords for child in token.head.children):
                return "urgent"
            return "normal"

    # Check if the due date is within the next day
    date_part, time_part = task["dueDate"].split("T")
    year, month, day = map(int, date_part.split("-"))
    hour, minute = map(int, time_part.split(":")[:-1])
    date = datetime.datetime(year, month, day, hour, minute)
    if any(phrase in urgency_phrases for phrase in doc.text) or any(ent.label_ in {"DATE", "TIME"} for ent in doc.ents) or task["category"].lower() in urgency_keywords or date < datetime.datetime.now() + datetime.timedelta(days=1):
        return "urgent"
    return "normal"
