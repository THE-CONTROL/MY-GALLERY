from secrets import token_urlsafe
from math import ceil


class Queries:
    @staticmethod
    def filter_one(model, value, checker):
        return model.query.filter(value == checker).first()

    @staticmethod
    def generate():
        return token_urlsafe(10)

    @staticmethod
    def paginate(page, items):
        page = int(page)
        page_size = 6
        start = (page - 1) * page_size
        if len(items) > start + page_size:
            end = start + page_size
        else:
            end = len(items)
        pages = ceil((len(items) / page_size))
        if page - 1 > 0:
            prev_page = page - 1
        else:
            prev_page = None
        if page + 1 > pages:
            next_page = None
        else:
            next_page = page + 1

        meta = {"page": page, "next_page": next_page, "prev_page": prev_page, "pages": list((range(1, pages+1))),
                "num_items": len(items), "last_item": end}

        new_items = items[start:end]

        info = {"meta": meta, "items": new_items}

        return info
